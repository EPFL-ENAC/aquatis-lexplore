<template>
    <TopPageNav :tabs="liveDataPageGroups" />

    <PageHeader eyebrow="01 · LIVE - Température en profondeur" :level="1">
        <template #default>
            Plus on descend,
            <br />
            plus l'eau refroidit.
        </template>
    </PageHeader>

    <TemperatureDepthPlot :rows="temperatureRows" :max-value="25" />
    <PlotAppendix :measured-at="lakeStore.data?.timestampOfMeasurementSeconds" />

    <QuestionCardsRow :items="questionCards" />
</template>

<script setup lang="ts">
import TopPageNav from 'src/components/TopPageNav.vue';
import PageHeader from 'src/components/PageHeader.vue';
import TemperatureDepthPlot from 'src/components/plots/TemperatureDepthPlot.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';
import { useWeatherStore, useLakeStore } from 'src/stores/lexplore';
import { computed } from 'vue';
import { liveDataPageGroups } from './liveDataNavGroups';

const weatherStore = useWeatherStore();
const lakeStore = useLakeStore();

const temperatureRows = computed(() => [
    { label: 'Air', value: weatherStore.data?.airTemperature ?? 0 },
    { label: '0m', value: lakeStore.data?.surfaceTemperature ?? 0 },
    { label: '24m', value: lakeStore.data?.temperatureOverDepth?.at('rightmost', 24) ?? 0 },
    { label: '50m', value: lakeStore.data?.temperatureOverDepth?.at('rightmost', 50) ?? 0 },
    { label: '75m', value: lakeStore.data?.temperatureOverDepth?.at('rightmost', 75) ?? 0 },
    { label: '90m', value: lakeStore.data?.temperatureOverDepth?.at('rightmost', 90) ?? 0 },
]);

const questionCards = [
    {
        id: '01',
        kicker: 'QUESTION #1',
        title: "Observes-tu une différence entre l'air et l'eau ?",
    },
    {
        id: '02',
        kicker: 'QUESTION #2',
        title: "Est-ce qu'il fait plus froid à 50 m ou à 100 m ?",
    },
];
</script>

<style scoped></style>
