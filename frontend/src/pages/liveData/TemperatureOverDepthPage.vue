<template>
    <TopPageNav :tabs="liveDataItems" />

    <PageHeader eyebrow="01 · LIVE - Température en profondeur" :level="1">
        <template #default>
            Plus on descend,
            <br />
            plus l'eau refroidit.
        </template>
    </PageHeader>

    <TemperatureOverDepthPlot :rows="temperatureRows" />
    <PlotAppendix :measured-at="lakeStore.data?.timestamps.at(-1)" />

    <QuestionCardsRow :items="questionCards" />
</template>

<script setup lang="ts">
import TopPageNav from 'src/components/TopPageNav.vue';
import PageHeader from 'src/components/PageHeader.vue';
import TemperatureOverDepthPlot from 'src/components/plots/TemperatureOverDepthPlot.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';
import { useWeatherStore, useLakeStore } from 'src/stores/lexplore';
import { computed } from 'vue';
import { liveDataItems } from './liveDataNavGroups';

const weatherStore = useWeatherStore();
const lakeStore = useLakeStore();

const temperatureRows = computed(() => [
    {
        label: 'Air',
        depth: -15,
        value: weatherStore.data?.airTemperature.at(-1) ?? 0,
    },
    {
        label: '0m',
        depth: 0,
        value: lakeStore.data?.surfaceTemperature.at(-1) ?? 0,
    },
    {
        label: '24m',
        depth: 24,
        value: lakeStore.data?.temperatureOverDepth?.at('rightmost', 24) ?? 0,
    },
    {
        label: '50m',
        depth: 50,
        value: lakeStore.data?.temperatureOverDepth?.at('rightmost', 50) ?? 0,
    },
    {
        label: '80m',
        depth: 80,
        value: lakeStore.data?.temperatureOverDepth?.at('rightmost', 80) ?? 0,
    },
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
