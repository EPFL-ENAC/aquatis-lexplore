<template>
    <q-page class="leman-page text-white">
        <div class="page-shell">
            <TopPageNav :tabs="liveDataItems" back-to="/liveData" :back-label="t('back')" />

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
                :max-depth="100"
                :margin-top="10"
                :depth-axis-x="132"
            />
            <PlotAppendix :measured-at="zooplanktonDepthStore.lastAvailableTimestamp" />

            <QuestionCardsRow :items="questionCards" :columns="1" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import PlanctonDepthPlot from 'src/components/plots/PlanctonDepthPlot.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';
import { useZooplanctonDepthStore } from 'src/stores/lexplore';
import { getLiveDataItems } from './liveDataNavGroups';

const { t } = useI18n();
const zooplanktonDepthStore = useZooplanctonDepthStore();
const liveDataItems = computed(() => getLiveDataItems(t));

const questionCards = computed(() => [
    {
        id: '01',
        kicker: `${t('question')} #1`,
        title: t('zooDepthQ1'),
    },
]);
</script>

<style scoped></style>
