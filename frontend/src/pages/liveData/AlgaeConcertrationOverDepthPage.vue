<template>
    <q-page class="leman-page text-white">
        <div class="page-shell">
            <TopPageNav :tabs="liveDataItems" back-to="/liveData" back-label="Retour" />

            <PageHeader eyebrow="01 · LIVE - Concentration des Microalgues" :level="1">
                <template #default>
                    Des forêts
                    <br />
                    microscopiques.
                </template>

                <template #subtitle>
                    Les microalgues du Léman sont appelées phytoplancton. La concentration grimpe en
                    été, avec la lumière et la chaleur du soleil.
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
import PageHeader from 'src/components/PageHeader.vue';
import DepthProfilePlot, { type DepthLevel } from 'src/components/plots/DepthProfilePlot.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import { liveDataItems } from './liveDataNavGroups';
import { computed } from 'vue';
import { useAlgaeStore } from 'src/stores/lexplore';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';

const algaeStore = useAlgaeStore();

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
    return Math.ceil(maxDepthValue / 10) * 10; // Round up to nearest 10 for better visualization
});

const measuredAt = computed(() => algaeStore.data?.timestamps.at(-1));

const questionCards = [
    {
        id: '01',
        kicker: 'QUESTION #1',
        title: 'À quelle profondeur la concentration de plancton est la plus haute ?',
    },
];
</script>

<style scoped></style>
