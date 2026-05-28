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

            <PlanktonAdventurePlot
                :samples="samples"
                :selected-timestamp="selectedTimestamp"
                icon-src="/copepode.png"
                :max-depth="100"
            />

            <TimestampSlider
                v-model="selectedTimestamp"
                :start-timestamp="range.start * 1000"
                :end-timestamp="range.end * 1000"
            />

            <QuestionCardsRow :items="questions" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import PlanktonAdventurePlot, {
    type DepthSample,
} from 'src/components/plots/PlanktonAdventurePlot.vue';
import TimestampSlider from 'src/components/TimestampSlider.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import { getGamesNavGroups } from './gamesNavGroups';
import { useZooplanctonDepthStore } from 'src/stores/lexplore';

const { t } = useI18n();
const zooplanktonDepthStore = useZooplanctonDepthStore();
const gamesNavGroups = computed(() => getGamesNavGroups(t));

const selectedTimestamp = ref<number>(Date.now() / 1000);
const range = computed(() => zooplanktonDepthStore.lastFullDayOfDataTimestampRange);

const samples = computed(() => {
    if (!zooplanktonDepthStore.zooplanctonDepthPlotByTimestamp || !range.value) {
        return [];
    }

    const samples: DepthSample[] = [];
    for (const [t, values] of Object.entries(
        zooplanktonDepthStore.zooplanctonDepthPlotByTimestamp,
    )) {
        const timestamp = Number(t);
        if (timestamp >= range.value.start && timestamp < range.value.end) {
            samples.push({
                timestamp,
                depth: values.y,
            });
        }
    }

    return samples;
});

const questions = computed(() => [
    {
        id: '01',
        kicker: t('question'),
        title: t('planctonGameQ1'),
    },
]);
</script>
