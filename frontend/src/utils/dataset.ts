import {
    type DatasetData,
    type DatasetFile,
    DatasetFileCollection,
    type DatasetFileDataChunk,
} from './datasetFileCollection';

const API_BASE = 'https://api.datalakes-eawag.ch';

export interface DatasetParameter {
    id: number;
    datasets_id: number;
    parameters_id: number;
    sensors_id: number;
    axis: string;
    parseparameter: string;
    unit: string;
    link: string | null;
    detail: string;
}

export interface DatasetMetadata {
    files: DatasetFileCollection;
    parameters: DatasetParameter[];
}

type DatasetAxisData = number[] | number[][];

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed with ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}

function cloneAxisData(data: DatasetAxisData): DatasetAxisData {
    if (data.length === 0) {
        return [];
    }

    if (Array.isArray(data[0])) {
        return (data as number[][]).map((row) => [...row]);
    }

    return [...(data as number[])];
}

function mergeAxisData(
    left: DatasetAxisData,
    right: DatasetAxisData,
    axis: string,
): DatasetAxisData {
    if (left.length === 0) {
        return cloneAxisData(right);
    }

    if (right.length === 0) {
        return cloneAxisData(left);
    }

    const leftIsMatrix = Array.isArray(left[0]);
    const rightIsMatrix = Array.isArray(right[0]);

    if (leftIsMatrix !== rightIsMatrix) {
        throw new Error(`Incompatible data shape while merging axis "${axis}" across files`);
    }

    if (leftIsMatrix) {
        return [...(left as number[][]), ...(right as number[][])];
    }

    return [...(left as number[]), ...(right as number[])];
}

function mergeRequestedAxes(chunks: DatasetFileDataChunk[], axes: string[]): DatasetData {
    const merged: DatasetData = {};

    for (const axis of axes) {
        const axisValues = chunks
            .map((chunk) => chunk.data[axis])
            .filter((value): value is DatasetAxisData => value !== undefined);

        if (axisValues.length === 0) {
            continue;
        }

        let mergedAxis = cloneAxisData(axisValues[0]!);

        for (let i = 1; i < axisValues.length; i += 1) {
            mergedAxis = mergeAxisData(mergedAxis, axisValues[i]!, axis);
        }

        merged[axis] = mergedAxis;
    }

    return merged;
}

export class Dataset {
    public readonly id: number;
    public readonly metadata: DatasetMetadata;
    public readonly latestFile: DatasetFile;
    public readonly data: DatasetData;

    constructor(args: {
        id: number;
        metadata: DatasetMetadata;
        latestFile: DatasetFile;
        data: DatasetData;
    }) {
        this.id = args.id;
        this.metadata = args.metadata;
        this.latestFile = args.latestFile;
        this.data = args.data;
    }

    static async fromId(id: number): Promise<Dataset> {
        const [files, parameters] = await Promise.all([
            this.fetchFiles(id),
            this.fetchParameters(id),
        ]);

        const fileCollection = new DatasetFileCollection(files);
        const latestFileData = await fileCollection.getLatestData();

        if (!latestFileData) {
            throw new Error(`No files found for dataset ${id}`);
        }

        return new Dataset({
            id,
            metadata: {
                files: fileCollection,
                parameters,
            },
            latestFile: latestFileData.file,
            data: latestFileData.data,
        });
    }

    getAvailableAxesLabel(): string[] {
        return [...new Set(this.metadata.parameters.map((parameter) => parameter.parseparameter))];
    }

    async getData(
        startTimestamp: number,
        endTimestamp: number,
        axesLabels: string[],
        rename: boolean = true,
    ): Promise<DatasetData> {
        if (endTimestamp < startTimestamp) {
            throw new Error('endTimestamp must be greater than or equal to startTimestamp');
        }

        const nameToLabel: Record<string, string> = {};
        for (const parameter of this.metadata.parameters) {
            if (axesLabels.includes(parameter.parseparameter)) {
                nameToLabel[parameter.axis] = parameter.parseparameter;
            }
        }

        const chunks = await this.metadata.files.getDataForTimeRange(startTimestamp, endTimestamp);
        const data = mergeRequestedAxes(chunks, Object.keys(nameToLabel));
        if (!rename) {
            return data;
        }

        const renamedData: DatasetData = {};
        for (const name in data) {
            const label = nameToLabel[name]!;
            renamedData[label] = data[name]!;
        }
        return renamedData;
    }

    private static async fetchFiles(id: number): Promise<DatasetFile[]> {
        return fetchJson<DatasetFile[]>(`${API_BASE}/files?datasets_id=${id}&type=json`);
    }

    private static async fetchParameters(id: number): Promise<DatasetParameter[]> {
        return fetchJson<DatasetParameter[]>(`${API_BASE}/datasetparameters?datasets_id=${id}`);
    }
}
