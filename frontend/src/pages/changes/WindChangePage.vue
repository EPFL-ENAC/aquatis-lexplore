<template>
    <PageHeader :eyebrow="t('windChangeEyebrow')" eyebrow-class="text-warning" :level="1">
        <template #default> {{ t('windChangeTitle') }} </template>
    </PageHeader>

    <ChartContainer :legendItems="tracksInLegend">
        <ScrollableTracksChart
            :timeline="timeline"
            :px-per-hour="10"
            :tick-every-minutes="8 * 60"
            :track-height="128"
            :axis-height="58"
            :bar-gap="2"
            :line-stroke-width="3"
            :locale="locale"
        />
    </ChartContainer>

    <QuestionCardsRow :items="questions" kickerClass="text-warning" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import ScrollableTracksChart from 'src/components/plots/timeline/ScrollableTrackChart.vue';
import ChartContainer from 'src/components/ChartContainer.vue';
import { Timeline, Track } from 'src/components/plots/timeline/types';
import { useBuoyStore, useLakeStore, useWeatherStore } from 'src/stores/lexplore';

const weatherStore = useWeatherStore();
const lakeStore = useLakeStore();
const buoyStore = useBuoyStore();

const { locale, t } = useI18n();

function toMs(timestamp: number): number {
    return timestamp * 1000;
}

const tracks = computed(() => {
    const result: Track[] = [];

    if (weatherStore.data) {
        result.push(
            new Track({
                title: t('windChangeTrackAirTemp'),
                type: 'line',
                color: '#ff5e66',
                data: weatherStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: weatherStore.data!.airTemperature[index]!,
                })),
            }),
        );
    }

    if (lakeStore.data) {
        result.push(
            new Track({
                title: t('windChangeTrackWaterTemp'),
                type: 'line',
                color: '#2b67f0',
                data: lakeStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: lakeStore.data!.surfaceTemperature[index]!,
                })),
            }),
        );
    }

    if (weatherStore.data) {
        const bucketSizeMs = 8 * 60 * 60 * 1000;

        result.push(
            Track.buckets(
                {
                    title: t('windChangeTrackWindDirection'),
                    type: 'wind',
                    color: '#7ed957',
                },
                weatherStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: weatherStore.data!.windDirectionDegrees[index]!,
                })),
                bucketSizeMs,
            ),
        );

        result.push(
            Track.buckets(
                {
                    title: t('windChangeTrackWindSpeed'),
                    type: 'number',
                    color: '#7ed957',
                },
                weatherStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: weatherStore.data!.windSpeed[index]!,
                })),
                bucketSizeMs,
            ),
        );
        result.push(
            Track.buckets(
                {
                    title: t('windChangeTrackPrecipitation'),
                    type: 'bar',
                    color: '#4db8ff',
                },
                weatherStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: weatherStore.data!.precipitation[index]!,
                })),
                3 * 60 * 60 * 1000,
            ),
        );
    }

    if (buoyStore.data) {
        result.push(
            Track.buckets(
                {
                    title: t('windChangeTrackWaveHeight'),
                    color: '#c08cff',
                    type: 'bar',
                },
                buoyStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: buoyStore.data!.height[index]!,
                })),
                3 * 60 * 60 * 1000,
            ),
        );
    }

    return result;
});

const timeline = computed(() => new Timeline(tracks.value));

const tracksInLegend = computed(() => tracks.value.filter((track) => track.type !== 'wind'));

const questions = computed(() => [
    {
        id: '01',
        kicker: t('question'),
        title: t('windChangeQ1'),
    },
    {
        id: '02',
        kicker: t('question'),
        title: t('windChangeQ2'),
    },
]);
</script>
