import { defineStore } from 'pinia';
import { Dataset } from 'src/utils/dataset';
import { onMounted, onUnmounted, ref } from 'vue';

interface MeasurementData {
    timestampOfMeasurementSeconds: number;
}

// Dataset 459
interface WeatherData extends MeasurementData {
    airTemperature: number;
    irradiance: number;
    windSpeed: number;
    windDirectionDegrees: number;
    precipitation: number;
}

// Dataset 885
interface BuoyData extends MeasurementData {
    height: number;
}

// Dataset 448
interface LakeData extends MeasurementData {
    waterTemperature: number;
}

// Dataset 875
interface AlgaeData extends MeasurementData {
    chlorophyllA: number;
}

const useLexploreStore = defineStore('lexplore', () => {
    const weatherData = ref<WeatherData | null>(null);
    const pullingWeatherData = ref(false);

    const buoyData = ref<BuoyData | null>(null);
    const pullingBuoyData = ref(false);

    const lakeData = ref<LakeData | null>(null);
    const pullingLakeData = ref(false);

    const algaeData = ref<AlgaeData | null>(null);
    const pullingAlgaeData = ref(false);

    let weatherDataset: Dataset | null = null;
    let buoyDataset: Dataset | null = null;
    let lakeDataset: Dataset | null = null;
    let algaeDataset: Dataset | null = null;

    let weatherDataInterval: ReturnType<typeof setInterval> | null = null;
    let buoyDataInterval: ReturnType<typeof setInterval> | null = null;
    let lakeDataInterval: ReturnType<typeof setInterval> | null = null;
    let algaeDataInterval: ReturnType<typeof setInterval> | null = null;

    onMounted(async () => {
        [weatherDataset, buoyDataset, lakeDataset, algaeDataset] = await Promise.all([
            Dataset.fromId(459),
            Dataset.fromId(885),
            Dataset.fromId(448),
            Dataset.fromId(875),
        ]);

        weatherDataInterval = setInterval(() => {
            void getWeatherData();
        }, 10_000);

        buoyDataInterval = setInterval(() => {
            void getBuoyData();
        }, 10_000);

        lakeDataInterval = setInterval(() => {
            void getLakeData();
        }, 10_000);

        algaeDataInterval = setInterval(() => {
            void getAlgaeData();
        }, 10_000);

        await Promise.all([getWeatherData(), getBuoyData(), getLakeData(), getAlgaeData()]);
    });

    onUnmounted(() => {
        if (weatherDataInterval) {
            clearInterval(weatherDataInterval);
        }

        if (buoyDataInterval) {
            clearInterval(buoyDataInterval);
        }

        if (lakeDataInterval) {
            clearInterval(lakeDataInterval);
        }

        if (algaeDataInterval) {
            clearInterval(algaeDataInterval);
        }
    });

    function getTimeRange() {
        const now = Date.now();
        const yesterday = now - 24 * 60 * 60 * 1000;

        return { now, yesterday };
    }

    async function getWeatherData() {
        if (!weatherDataset) {
            throw new Error('Weather dataset not loaded');
        }

        pullingWeatherData.value = true;

        try {
            const { now, yesterday } = getTimeRange();

            const data = await weatherDataset.getData(yesterday, now, [
                'time',
                'AirTC',
                'Slrw',
                'WS',
                'WindDir',
                'Rain',
            ]);

            console.log('Weather dataset returned data:', data);

            const timeAxis = data['time'];
            const airTCAxis = data['AirTC'];
            const irradianceAxis = data['Slrw'];
            const windSpeedAxis = data['WS'];
            const windDirectionAxis = data['WindDir'];
            const precipitationAxis = data['Rain'];

            if (
                !timeAxis ||
                !airTCAxis ||
                !irradianceAxis ||
                !windSpeedAxis ||
                !windDirectionAxis ||
                !precipitationAxis
            ) {
                throw new Error('Missing required axes in weather dataset');
            }

            if (timeAxis.length === 0) {
                throw new Error('Weather dataset returned no data');
            }

            const latestIndex = timeAxis.length - 1;

            weatherData.value = {
                timestampOfMeasurementSeconds: timeAxis[latestIndex] as number,
                airTemperature: airTCAxis[latestIndex] as number,
                irradiance: irradianceAxis[latestIndex] as number,
                windSpeed: windSpeedAxis[latestIndex] as number,
                windDirectionDegrees: windDirectionAxis[latestIndex] as number,
                precipitation: precipitationAxis[latestIndex] as number,
            };
        } finally {
            pullingWeatherData.value = false;
        }
    }

    async function getBuoyData() {
        if (!buoyDataset) {
            throw new Error('Buoy dataset not loaded');
        }

        pullingBuoyData.value = true;

        try {
            const { now, yesterday } = getTimeRange();

            const data = await buoyDataset.getData(yesterday, now, [
                'time',
                'hs', // Replace with the real axis name for dataset 885
            ]);

            console.log('Buoy dataset returned data:', data);

            const timeAxis = data['time'];
            const heightAxis = data['hs'];

            if (!timeAxis || !heightAxis) {
                throw new Error('Missing required axes in buoy dataset');
            }

            if (timeAxis.length === 0) {
                throw new Error('Buoy dataset returned no data');
            }

            const latestIndex = timeAxis.length - 1;

            buoyData.value = {
                timestampOfMeasurementSeconds: timeAxis[latestIndex] as number,
                height: heightAxis[latestIndex] as number,
            };
        } finally {
            pullingBuoyData.value = false;
        }
    }

    async function getLakeData() {
        if (!lakeDataset) {
            throw new Error('Lake dataset not loaded');
        }

        pullingLakeData.value = true;

        try {
            const { now, yesterday } = getTimeRange();

            const data = await lakeDataset.getData(yesterday, now, [
                'time',
                'surfacetemp', // Replace with temp to have temp over depth
            ]);

            const timeAxis = data['time'];
            const waterTemperatureAxis = data['surfacetemp'];

            if (!timeAxis || !waterTemperatureAxis) {
                throw new Error('Missing required axes in lake dataset');
            }

            if (timeAxis.length === 0) {
                throw new Error('Lake dataset returned no data');
            }

            const latestIndex = timeAxis.length - 1;

            lakeData.value = {
                timestampOfMeasurementSeconds: timeAxis[latestIndex] as number,
                waterTemperature: waterTemperatureAxis[latestIndex] as number,
            };
        } finally {
            pullingLakeData.value = false;
        }
    }

    async function getAlgaeData() {
        if (!algaeDataset) {
            throw new Error('Algae dataset not loaded');
        }

        pullingAlgaeData.value = true;

        try {
            const { now, yesterday } = getTimeRange();

            const data = await algaeDataset.getData(yesterday, now, ['time', 'ChlA']);

            const timeAxis = data['time'];
            const chlorophyllAAxis = data['ChlA'];

            if (!timeAxis || !chlorophyllAAxis) {
                throw new Error('Missing required axes in algae dataset');
            }

            if (timeAxis.length === 0) {
                throw new Error('Algae dataset returned no data');
            }

            const latestIndex = timeAxis.length - 1;

            algaeData.value = {
                timestampOfMeasurementSeconds: timeAxis[latestIndex] as number,
                chlorophyllA: chlorophyllAAxis[latestIndex] as number,
            };
        } finally {
            pullingAlgaeData.value = false;
        }
    }

    return {
        weatherData,
        pullingWeatherData,
        buoyData,
        pullingBuoyData,
        lakeData,
        pullingLakeData,
        algaeData,
        pullingAlgaeData,
        getWeatherData,
        getBuoyData,
        getLakeData,
        getAlgaeData,
    };
});

export default useLexploreStore;
