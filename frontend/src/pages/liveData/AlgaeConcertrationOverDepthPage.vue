<template>
    <PageHeader :eyebrow="t('algaeConcEyebrow')" :level="1">
        <template #default>
            {{ t('algaeConcTitle') }}
        </template>

        <template #subtitle>
            {{ t('algaeConcSubtitle') }}
        </template>
    </PageHeader>

    <ChlorophyllOverDepthPlot
        v-if="dataPoints.length > 0"
        :rows="dataPoints"
        :value-end="maxX"
        :margin-top="10"
        :depth-axis-x="132"
        unit="µg/L"
    />
    <PlotAppendix :measured-at="measuredAt" />

    <QuestionCardsRow :items="questionCards" :columns="1" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import ChlorophyllOverDepthPlot from 'src/components/plots/waterDepth/ChlorophyllOverDepthPlot.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import { computed } from 'vue';
import { useAlgaeStore } from 'src/stores/lexplore';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';

const { t } = useI18n();
const algaeStore = useAlgaeStore();

const dataPoints = computed(() => {
    if (!algaeStore.data) {
        return [];
    }

    const levels = [2, 10, 20, 30, 40, 50, 60, 70, 80];

    return levels.map((level) => ({
        label: `${level}m`,
        depth: level,
        value: (algaeStore.data!.chlorophyllAOverDepth.at('rightmost', level) as number) ?? 0,
    }));
});

const maxX = computed(() => {
    const maxValue = Math.max(...dataPoints.value.map((p) => p.value));
    return Math.ceil(maxValue);
});

const measuredAt = computed(() => algaeStore.data?.timestamps.at(-1));

const questionCards = computed(() => [
    {
        id: '01',
        kicker: `${t('question')} #1`,
        title: t('algaeConcQ1'),
    },
]);
</script>

<style scoped></style>
