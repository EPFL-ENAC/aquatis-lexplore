<template>
    <q-page class="leman-page text-white">
        <div class="page-shell">
            <TopPageNav :tabs="liveDataPageGroups" back-to="/liveData" back-label="Retour" />

            <PageHeader eyebrow="01 · LIVE - Profondeur du Zooplancton" :level="1">
                <template #default>
                    Il monte la nuit,
                    <br />
                    il descend le jour.
                </template>

                <template #subtitle>
                    Le plancton animal bouge entre le fond et la surface pour manger et pour se
                    cacher des poissons.
                </template>
            </PageHeader>

            <!-- <ZooplanktonDepthPlot
                :levels="levels"
                :organisms="organisms"
                :icon-src="zooplanktonIcon"
                :max-depth="100"
            /> -->

            <DepthHeatmapPlot
                v-if="zooplanctonDepthStore.processedBackscatterHeatmap"
                :heatmap="zooplanctonDepthStore.processedBackscatterHeatmap"
                :highlight-column-maxima="true"
            />

            <pre>{{ zooplanctonDepthStore.processedBackscatterHeatmap?.zValuesMinMax() }}</pre>

            <QuestionCardsRow :items="questionCards" :columns="1" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import DepthHeatmapPlot from 'src/components/plots/DepthHeatmapPlot.vue';
// import ZooplanktonDepthPlot from 'src/components/live/ZooplanktonDepthPlot.vue';
// import zooplanktonIcon from 'src/assets/zooplankton.png';
import TopPageNav from 'src/components/TopPageNav.vue';
import { liveDataPageGroups } from './liveDataNavGroups';
import { useZooplanctonDepthStore } from 'src/stores/lexplore';

const zooplanctonDepthStore = useZooplanctonDepthStore();

const questionCards = [
    {
        id: '01',
        kicker: 'QUESTION #1',
        title: 'À quelle profondeur vois-tu le plancton maintenant ?',
    },
];
</script>

<style scoped></style>
