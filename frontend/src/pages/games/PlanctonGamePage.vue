<template>
    <q-page class="leman-page text-white">
        <div v-if="range" class="page-shell">
            <TopPageNav
                :tabs="gamesNavGroups"
                active-href="/games/planctonGame"
                back-to="/games"
                :back-label="t('back')"
            />

            <PageHeader
                :eyebrow="t('planctonGameEyebrow')"
                eyebrow-class="text-negative"
                :level="1"
            >
                <template #default> {{ t('planctonGameTitle') }} </template>

                <template #subtitle>
                    {{ t('planctonGameSubtitle') }}
                </template>
            </PageHeader>

            <PlanctonDepthPlot
                v-if="zooplanktonDepthStore.lastRecordedDepth !== null"
                :plancton-depth="planctonDepth?.y ?? 0"
                :max-depth="100"
                :margin-top="10"
                :depth-axis-x="132"
            />

            <TimestampSlider
                v-model="selectedTimestamp"
                :start-timestamp="range.start * 1000"
                :end-timestamp="range.end * 1000"
            />

            <PlotAppendix :measured-at="zooplanktonDepthStore.lastAvailableTimestamp" />

            <QuestionCardsRow :items="questions" kickerClass="text-negative" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import PlanctonDepthPlot from 'src/components/plots/PlanctonDepthPlot.vue';
import TimestampSlider from 'src/components/TimestampSlider.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import PlotAppendix from 'src/components/plots/PlotAppendix.vue';
import { getGamesNavGroups } from './gamesNavGroups';
import { useZooplanctonDepthStore } from 'src/stores/lexplore';

const { t } = useI18n();
const zooplanktonDepthStore = useZooplanctonDepthStore();
const gamesNavGroups = computed(() => getGamesNavGroups(t));

const selectedTimestamp = ref<number>(Date.now() / 1000);
const range = computed(() => zooplanktonDepthStore.lastFullDayOfDataTimestampRange);

const planctonDepth = computed(() => {
    if (!zooplanktonDepthStore.processedBackscatterHeatmap || !range.value) {
        return null;
    }

    return zooplanktonDepthStore.processedBackscatterHeatmap.columnMaximaAtTimestamp(
        selectedTimestamp.value,
    );
});

const questions = computed(() => [
    {
        id: '01',
        kicker: t('question'),
        title: t('planctonGameQ1'),
    },
]);
</script>
