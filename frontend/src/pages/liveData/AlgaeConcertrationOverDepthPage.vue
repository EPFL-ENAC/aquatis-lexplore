<template>
    <q-page class="leman-page text-white">
        <div class="page-shell">
            <TopPageNav :tabs="liveDataItems" back-to="/liveData" :back-label="t('back')" />

            <PageHeader :eyebrow="t('algaeConcEyebrow')" :level="1">
                <template #default>
                    {{ t('algaeConcTitle').replace('\n', '') }}
                    <br />
                    {{ t('algaeConcTitle').split('\n')[1] }}
                </template>

                <template #subtitle>
                    {{ t('algaeConcSubtitle') }}
                </template>
            </PageHeader>

            <DepthProfilePlot
                :levels="levels"
                :points="dataPoints"
                :max-x="maxX"
                :max-depth="maxDepth"
            />
            <PlotAppendix :measured-at="measuredAt" />

            <QuestionCardsRow :items="questionCards" :columns="1" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import DepthProfilePlot, { type DepthLevel } from 'src/components/plots/DepthProfilePlot.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import { getLiveDataItems } from './liveDataNavGroups';
import { computed } from 'vue';
import { useAlgaeStore } from 'src/stores/lexplore';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';

const { t } = useI18n();
const algaeStore = useAlgaeStore();
const liveDataItems = computed(() => getLiveDataItems(t));

function makeLevel(depth: number): DepthLevel {
    return {
        label: `${depth}m`,
        depth,
    };
}

const levels = computed(() => {
    return [1, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].map(makeLevel);
});

const dataPoints = computed(() => {
    if (!algaeStore.data) {
        return [];
    }
    return levels.value.map((level) => ({
        depth: level.depth,
        value: (algaeStore.data!.chlorophyllAOverDepth.at('rightmost', level.depth) as number) ?? 0,
    }));
});

const maxX = computed(() => {
    const maxValue = Math.max(...dataPoints.value.map((p) => p.value));
    return Math.ceil(maxValue);
});

const maxDepth = computed(() => {
    const maxDepthValue = Math.max(...dataPoints.value.map((p) => p.depth));
    return Math.ceil(maxDepthValue / 10) * 10;
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
