import { defineStore } from 'pinia';
import { Array2D } from 'src/utils/array2d';
import { Dataset } from 'src/utils/dataset';
import { DepthHeatmap } from 'src/utils/depthHeatmap';
import { closestAboveSorted, closestBelowSorted, getInterpolationT, lerp } from 'src/utils/math';
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue';

interface MeasurementData {
    timestamps: number[];
}

// Dataset 459
interface WeatherData extends MeasurementData {
    airTemperature: number[];
    irradiance: number[];
    windSpeed: number[];
    windDirectionDegrees: number[];
    precipitation: number[];
}

// Dataset 885
interface BuoyData extends MeasurementData {
    height: number[];
}

// Dataset 448
interface LakeData extends MeasurementData {
    surfaceTemperature: number[];
    temperatureOverDepth: DepthHeatmap;
}

// Dataset 875
interface AlgaeData extends MeasurementData {
    chlorophyllAOverDepth: DepthHeatmap;
}

interface LexploreDatasetStoreOptions {
    refreshIntervalMs?: number;
    datasetMaxAgeMs?: number;
}

function makeLexploreDatasetStore<T>(
    id: number,
    extractData: (d: Dataset) => Promise<T>,
    options?: LexploreDatasetStoreOptions,
) {
    options = {
        refreshIntervalMs: 10_000,
        datasetMaxAgeMs: 60_000,
        ...options,
    };

    return defineStore(`lexplore-dataset-${id}`, () => {
        const dataset = shallowRef<Dataset | null>(null);
        const data = ref<T | null>(null);
        const loading = ref(false);
        const lastPullTimestamp = ref<number | null>(null);
        const error = ref<Error | null>(null);

        async function pullDataset() {
            loading.value = true;

            try {
                if (
                    !dataset.value ||
                    Date.now() - (lastPullTimestamp.value ?? 0) > options!.datasetMaxAgeMs!
                ) {
                    dataset.value = await Dataset.fromId(id);
                }
                data.value = await extractData(dataset.value);
                error.value = null;
            } catch (err) {
                dataset.value = null;
                error.value = err instanceof Error ? err : new Error(String(err));
            } finally {
                loading.value = false;
                lastPullTimestamp.value = Date.now();
            }
        }

        let interval: ReturnType<typeof setInterval> | null = null;

        onMounted(() => {
            void pullDataset();

            interval = setInterval(() => {
                void pullDataset();
            }, options.refreshIntervalMs);
        });

        onUnmounted(() => {
            if (interval) {
                clearInterval(interval);
            }
        });

        return {
            dataset,
            data,
            loading,
            lastPullTimestamp,
            error,
            pullDataset,
        };
    });
}

export const useWeatherStore = makeLexploreDatasetStore<WeatherData>(459, async (dataset) => {
    const data = await dataset.getData({ type: 'latest' }, [
        'time',
        'AirTC',
        'Slrw',
        'WS',
        'WindDir',
        'Rain',
    ]);

    return {
        timestamps: data['time']! as number[],
        airTemperature: data['AirTC']! as number[],
        irradiance: data['Slrw']! as number[],
        windSpeed: (data['WS']! as number[]).map((v: number) => v * 3.6), // Convert from m/s to km/h
        windDirectionDegrees: data['WindDir']! as number[],
        precipitation: data['Rain']! as number[],
    };
});

export const useBuoyStore = makeLexploreDatasetStore<BuoyData>(885, async (dataset) => {
    const data = await dataset.getData({ type: 'latest' }, [
        'time',
        'hs', // Replace with the real axis name for dataset 885
    ]);

    return {
        timestamps: data['time']! as number[],
        height: data['hs']! as number[],
    };
});

export const useLakeStore = makeLexploreDatasetStore<LakeData>(448, async (dataset) => {
    const data = await dataset.getData({ type: 'latest' }, [
        'time',
        'depth',
        'temp',
        'surfacetemp',
    ]);

    return {
        timestamps: data['time']! as number[],
        surfaceTemperature: data['surfacetemp']! as number[],
        temperatureOverDepth: new DepthHeatmap({
            x: data['time'] as number[],
            y: data['depth'] as number[],
            z: Array2D.fromTransposed(data['temp'] as number[][]),
        }),
    };
});

export const useAlgaeStore = makeLexploreDatasetStore<AlgaeData>(875, async (dataset) => {
    const data = await dataset.getData({ type: 'latest' }, ['time', 'depth', 'Chl_A']);

    return {
        timestamps: data['time']! as number[],
        chlorophyllAOverDepth: new DepthHeatmap({
            x: data['time'] as number[],
            y: data['depth'] as number[],
            z: Array2D.fromTransposed(data['Chl_A'] as number[][]),
        }),
    };
});

export const useZooplanctonDepthStore = defineStore('zooplancton-depth', () => {
    const heatmapShallow = makeLexploreDatasetStore(600, async (dataset) => {
        const data = await dataset.getData({ type: 'latest' }, ['time', 'depth', 'Sv']);

        return new DepthHeatmap({
            x: data['time'] as number[],
            y: data['depth']?.reverse() as number[],
            z: Array2D.fromTransposed(data['Sv'] as number[][], true),
        });
    })();

    const heatmapDeep = makeLexploreDatasetStore(599, async (dataset) => {
        const data = await dataset.getData({ type: 'latest' }, ['time', 'depth', 'Sv']);

        return new DepthHeatmap({
            x: data['time'] as number[],
            y: data['depth'] as number[],
            z: Array2D.fromTransposed(data['Sv'] as number[][]),
        });
    })();

    const cleanBackscatterHeatmap = computed(() => {
        if (!heatmapShallow.data || !heatmapDeep.data) return null;
        const shallowSliced = heatmapShallow.data.slice({ yEnd: 24.45 }); // Data returns null deeper that this
        const deepSliced = heatmapDeep.data.slice({ yStart: 31.08, yEnd: 90.08 }); // Artifacts start there

        const bridgeY = [25.08, 26.08, 27.08, 28.08, 29.08, 30.08];

        return shallowSliced.toInterpolated(deepSliced.x).appendBelow(deepSliced, bridgeY);
    });

    const processedBackscatterHeatmap = computed(() => {
        if (!cleanBackscatterHeatmap.value) return null;
        return cleanBackscatterHeatmap.value
            .replaceDepthRangeByLerp(48.08, 51.08)
            .replaceDepthRangeByLerp(53.08, 60.08)
            .zScore()
            .smoothMovingAverage({ windowX: 31, windowY: 31 });
    });

    const zooplanctonDepthPlotByTimestamp = computed(() => {
        return processedBackscatterHeatmap.value?.maxZValuePlot();
    });

    function zooplanctonDepthAtTimestamp(timestamp: number): number | null {
        if (!zooplanctonDepthPlotByTimestamp.value) return null;

        const availableTimestamps = Object.keys(zooplanctonDepthPlotByTimestamp.value).map(Number);
        if (availableTimestamps.length === 0) {
            return null;
        }

        const below = closestBelowSorted(availableTimestamps, timestamp) ?? {
            index: 0,
            value: availableTimestamps[0]!,
        };
        const above = closestAboveSorted(availableTimestamps, timestamp) ?? {
            index: availableTimestamps.length - 1,
            value: availableTimestamps[availableTimestamps.length - 1]!,
        };
        const t = getInterpolationT(below.value, above.value, timestamp);

        return lerp(
            zooplanctonDepthPlotByTimestamp.value[below.value]!.y,
            zooplanctonDepthPlotByTimestamp.value[above.value]!.y,
            t,
        );
    }

    const lastFullDayOfDataTimestampRange = computed(() => {
        if (!zooplanctonDepthPlotByTimestamp.value) return null;

        const timestamps = Object.keys(zooplanctonDepthPlotByTimestamp.value).map(Number);
        if (timestamps.length === 0) {
            return null;
        }

        const maxTimestamp = timestamps[timestamps.length - 1]!;
        const minTimestamp = timestamps[0]!;

        const oneDaySeconds = 24 * 3600;
        const lastFullDayStart = Math.floor(maxTimestamp / oneDaySeconds) * oneDaySeconds;
        const lastFullDayEnd = lastFullDayStart + oneDaySeconds;

        if (lastFullDayEnd < minTimestamp) {
            return null;
        }

        return { start: lastFullDayStart, end: lastFullDayEnd };
    });

    const lastRecordedDepth = computed(() => {
        if (!zooplanctonDepthPlotByTimestamp.value) return null;

        const timestamps = Object.keys(zooplanctonDepthPlotByTimestamp.value).map(Number);
        if (timestamps.length === 0) {
            return null;
        }

        const lastTimestamp = timestamps[timestamps.length - 1]!;
        return zooplanctonDepthPlotByTimestamp.value[lastTimestamp]!.y;
    });

    return {
        cleanBackscatterHeatmap,
        processedBackscatterHeatmap,
        zooplanctonDepthPlotByTimestamp,
        zooplanctonDepthAtTimestamp,
        lastFullDayOfDataTimestampRange,
        lastRecordedDepth,
    };
});
