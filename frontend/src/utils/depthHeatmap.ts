import { arraysEqual, sortedArrayRange, uniqueSorted } from './array';
import { Array2D } from './array2d';
import { lerp } from './math';

export class DepthHeatmap {
    readonly x: number[];
    readonly y: number[];
    readonly z: Array2D;

    constructor(params?: { x?: number[]; y?: number[]; z?: number[][] | Array2D }) {
        this.x = [...(params?.x ?? [])];
        this.y = [...(params?.y ?? [])];

        const zData =
            params?.z instanceof Array2D
                ? params.z.getData().map((row) => [...row])
                : (params?.z ?? []).map((row) => [...row]);

        this.z = new Array2D(zData);

        this.validate();
    }

    static fromArrays(x: number[], y: number[], z: number[][]): DepthHeatmap {
        return new DepthHeatmap({ x, y, z });
    }

    static fromPoints(points: Array<{ x: number; y: number; z: number }>): DepthHeatmap {
        if (points.length === 0) {
            return new DepthHeatmap();
        }

        const xValues = uniqueSorted(points.map((p) => p.x));
        const yValues = uniqueSorted(points.map((p) => p.y));

        const xIndex = new Map<number, number>(xValues.map((value, i) => [value, i]));
        const yIndex = new Map<number, number>(yValues.map((value, i) => [value, i]));

        const z: Array<Array<number | undefined>> = Array.from({ length: xValues.length }, () =>
            Array<number | undefined>(yValues.length).fill(undefined),
        );

        for (const point of points) {
            const i = xIndex.get(point.x);
            const j = yIndex.get(point.y);

            if (i == null || j == null) {
                throw new Error('Failed to index point.');
            }

            if (z[i]?.[j] !== undefined) {
                throw new Error(`Duplicate point detected for x=${point.x}, y=${point.y}.`);
            }

            z[i]![j] = point.z;
        }

        const completeZ = z.map((row, i) =>
            row.map((value, j) => {
                if (value === undefined) {
                    throw new Error(
                        `Missing point in rectangular grid at x=${xValues[i]}, y=${yValues[j]}.`,
                    );
                }

                return value;
            }),
        );

        return new DepthHeatmap({
            x: xValues,
            y: yValues,
            z: completeZ,
        });
    }

    size(): number {
        return this.x.length * this.y.length;
    }

    zScore(sample = false): DepthHeatmap {
        return new DepthHeatmap({
            x: this.x,
            y: this.y,
            z: this.z.zScore(sample),
        });
    }

    appendBelow(other: DepthHeatmap, bridgeY: number[] = []): DepthHeatmap {
        if (!arraysEqual(this.x, other.x)) {
            throw new Error('Cannot append heatmaps: x values do not match exactly.');
        }

        if (this.y.length === 0 || other.y.length === 0) {
            throw new Error(
                'Cannot append heatmaps: both heatmaps must have at least one y value.',
            );
        }

        const leftEndY = this.y[this.y.length - 1]!;
        const rightStartY = other.y[0]!;

        if (!(leftEndY < rightStartY)) {
            throw new Error(
                'Cannot append heatmaps: other must start after this heatmap along the y axis.',
            );
        }

        const sortedMiddleY = DepthHeatmap.validateBridgeY(bridgeY, leftEndY, rightStartY);

        const thisData = this.z.getData();
        const otherData = other.z.getData();

        const newY = [...this.y, ...sortedMiddleY, ...other.y];

        const newZ = this.x.map((_, i) => {
            const topZ = thisData[i]!;
            const bottomZ = otherData[i]!;
            const z0 = topZ[topZ.length - 1]!;
            const z1 = bottomZ[0]!;

            const middleZ = sortedMiddleY.map((yValue) => {
                const t = (yValue - leftEndY) / (rightStartY - leftEndY);
                return lerp(z0, z1, t);
            });

            return [...topZ, ...middleZ, ...bottomZ];
        });

        return new DepthHeatmap({
            x: this.x,
            y: newY,
            z: newZ,
        });
    }

    smoothMovingAverage(params?: { windowX?: number; windowY?: number }): DepthHeatmap {
        const windowX = params?.windowX ?? 3;
        const windowY = params?.windowY ?? 3;

        return new DepthHeatmap({
            x: this.x,
            y: this.y,
            z: this.z.smoothMovingAverage(windowX, windowY),
        });
    }

    peakValueInRange(
        startXValue: number,
        endXValue: number,
        startY: number,
        endY: number,
        topPercent?: number,
    ): number | null {
        if (this.x.length === 0 || this.y.length === 0) {
            return null;
        }

        const [minXIndex, maxXIndex] = sortedArrayRange(this.x, startXValue, endXValue);
        const [minYIndex, maxYIndex] = sortedArrayRange(this.y, startY, endY);

        if (minXIndex === maxXIndex || minYIndex === maxYIndex) {
            return null;
        }

        return this.z.peakValueInRange(
            minXIndex,
            maxXIndex - 1,
            minYIndex,
            maxYIndex - 1,
            topPercent,
        );
    }

    toPoints(): Array<{ x: number; y: number; z: number }> {
        const points: Array<{ x: number; y: number; z: number }> = [];
        const data = this.z.getData();

        for (let i = 0; i < this.x.length; i += 1) {
            for (let j = 0; j < this.y.length; j += 1) {
                points.push({
                    x: this.x[i]!,
                    y: this.y[j]!,
                    z: data[i]![j]!,
                });
            }
        }

        return points;
    }

    private static validateBridgeY(
        bridgeY: number[],
        leftEndY: number,
        rightStartY: number,
    ): number[] {
        const sortedBridgeY = [...bridgeY].sort((a, b) => a - b);

        for (let i = 0; i < sortedBridgeY.length; i += 1) {
            const value = sortedBridgeY[i]!;

            if (!Number.isFinite(value)) {
                throw new Error(`bridgeY[${i}] must be a finite number.`);
            }

            if (!(value > leftEndY && value < rightStartY)) {
                throw new Error(
                    `bridgeY value ${value} must be strictly between ${leftEndY} and ${rightStartY}.`,
                );
            }

            if (i > 0 && sortedBridgeY[i - 1] === value) {
                throw new Error('bridgeY must not contain duplicates.');
            }
        }

        return sortedBridgeY;
    }

    private validate(): void {
        for (let i = 0; i < this.x.length; i += 1) {
            if (!Number.isFinite(this.x[i])) {
                throw new Error(`x[${i}] must be a finite number.`);
            }
        }

        for (let j = 0; j < this.y.length; j += 1) {
            if (!Number.isFinite(this.y[j])) {
                throw new Error(`y[${j}] must be a finite number.`);
            }
        }

        if (this.z.width !== this.x.length) {
            throw new Error('z must have exactly one row per x value: z.width === x.length.');
        }

        if (this.z.height !== this.y.length) {
            throw new Error('z must have exactly one column per y value: z.height === y.length.');
        }

        const data = this.z.getData();

        for (let i = 0; i < data.length; i += 1) {
            const row = data[i]!;

            if (row.length !== this.y.length) {
                throw new Error(`z[${i}] must have length ${this.y.length} to match y.`);
            }

            for (let j = 0; j < row.length; j += 1) {
                if (!Number.isFinite(row[j])) {
                    throw new Error(`z[${i}][${j}] must be a finite number.`);
                }
            }
        }
    }
}
