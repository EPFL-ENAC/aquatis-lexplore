<template>
    <q-page class="leman-page text-white">
        <div class="page-shell">
            <PageHeader :eyebrow="t('zooDepthEyebrow')" :level="1">
                <template #default>
                    {{ t('zooDepthTitle') }}
                </template>

                <template #subtitle>
                    {{ t('zooDepthSubtitle') }}
                </template>
            </PageHeader>

            <!-- <ZooplanktonDepthPlot
                :levels="levels"
                :organisms="organisms"
                :icon-src="zooplanktonIcon"
                :max-depth="100"
            /> -->

            <DepthHeatmapPlot
                v-if="zooplanktonDepthStore.processedBackscatterHeatmap"
                :heatmap="zooplanktonDepthStore.processedBackscatterHeatmap"
                :highlight-column-maxima="true"
            />

            <pre>{{ zooplanktonDepthStore.processedBackscatterHeatmap?.zValuesMinMax() }}</pre>

            <QuestionCardsRow :items="questionCards" :columns="1" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import DepthHeatmapPlot from 'src/components/plots/DepthHeatmapPlot.vue';
// import ZooplanktonDepthPlot from 'src/components/live/ZooplanktonDepthPlot.vue';
// import zooplanktonIcon from 'src/assets/zooplankton.png';
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

<style scoped></style>
