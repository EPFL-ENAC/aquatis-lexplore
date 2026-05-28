<template>
    <TopPageNav :tabs="liveDataItems" />

    <PageHeader :eyebrow="t('tempDepthEyebrow')" :level="1">
        <template #default>
            {{ t('tempDepthTitle').replace('\n', '') }}
            <br />
            {{ t('tempDepthTitle').split('\n')[1] }}
        </template>
    </PageHeader>

    <TemperatureOverDepthPlot :rows="temperatureRows" />
    <PlotAppendix :measured-at="lakeStore.data?.timestamps.at(-1)" />

    <QuestionCardsRow :items="questionCards" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TopPageNav from 'src/components/TopPageNav.vue';
import PageHeader from 'src/components/PageHeader.vue';
import TemperatureOverDepthPlot from 'src/components/plots/TemperatureOverDepthPlot.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';
import { useWeatherStore, useLakeStore } from 'src/stores/lexplore';
import { computed } from 'vue';
import { getLiveDataItems } from './liveDataNavGroups';

const { t } = useI18n();
const weatherStore = useWeatherStore();
const lakeStore = useLakeStore();
const liveDataItems = computed(() => getLiveDataItems(t));

const temperatureRows = computed(() => [
    {
        label: t('tempDepthAir'),
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

const questionCards = computed(() => [
    {
        id: '01',
        kicker: `${t('question')} #1`,
        title: t('tempDepthQ1'),
    },
    {
        id: '02',
        kicker: `${t('question')} #2`,
        title: t('tempDepthQ2'),
    },
]);
</script>

<style scoped></style>
