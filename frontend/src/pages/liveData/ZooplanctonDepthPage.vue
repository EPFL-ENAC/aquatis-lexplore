<template>
    <PageHeader :eyebrow="t('zooDepthEyebrow')" :level="1">
        <template #default>
            {{ t('zooDepthTitle') }}
        </template>

        <template #subtitle>
            {{ t('zooDepthSubtitle') }}
        </template>
    </PageHeader>

    <PlanctonDepthPlot
        v-if="zooplanktonDepthStore.lastRecordedDepth !== null"
        :plancton-depth="zooplanktonDepthStore.lastRecordedDepth"
        :maxPlotDepth="80"
        :depth-axis-x="132"
    />
    <ChartContainer v-else>
        <div class="loading">
            <q-circular-progress indeterminate rounded size="50px" color="white" class="q-ma-md" />
        </div>
    </ChartContainer>
    <PlotAppendix :measured-at="zooplanktonDepthStore.lastAvailableTimestamp" />

    <QuestionCardsRow :items="questionCards" :columns="1" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import PlanctonDepthPlot from 'src/components/plots/waterDepth/PlanctonDepthPlot.vue';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';
import ChartContainer from 'src/components/ChartContainer.vue';
import { useZooplanctonDepthStore } from 'src/stores/lexplore';

const { t } = useI18n();
const zooplanktonDepthStore = useZooplanctonDepthStore();

const questionCards = computed(() => [
    {
        id: '01',
        kicker: `${t('question')} #1`,
        title: t('zooDepthQ1'),
    },
]);
</script>

<style scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
}
</style>
