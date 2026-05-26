<template>
    <q-page class="leman-page text-white">
        <div v-if="range" class="page-shell">
            <TopPageNav
                :tabs="gamesPageGroups"
                active-href="/games/planctonGame"
                back-to="/games"
                back-label="Retour"
            />

            <PageHeader eyebrow="01 · L'aventure du Plancton" :level="1">
                <template #default> Bouge le curseur rouge. </template>

                <template #subtitle>
                    Observe le mouvement du zooplancton à travers la journée.
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
                :start-timestamp="range.start"
                :end-timestamp="range.end"
            />

            <QuestionCardsRow :items="questions" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PageHeader from 'src/components/PageHeader.vue';
import PlanktonAdventurePlot, {
    type DepthSample,
} from 'src/components/plots/PlanktonAdventurePlot.vue';
import TimestampSlider from 'src/components/TimestampSlider.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import { gamesPageGroups } from './gamesNavGroups';
import { useZooplanctonDepthStore } from 'src/stores/lexplore';

const zooplanctonDepthStore = useZooplanctonDepthStore();

const now = Math.floor(Date.now() / 1000);

const selectedTimestamp = ref<number>(now);

const range = computed(() => ({
    start: new Date(2026, 4, 22, 0, 0, 0).getTime(),
    end: new Date(2026, 4, 22, 23, 59, 59).getTime(),
})); // Placeholder range, replace with actual data

// const sunriseSunset = computed(() => sunriseSunsetTimeTodaySwitzerland());

const samples = computed(() => {
    const range = zooplanctonDepthStore.lastFullDayOfDataTimestampRange;

    if (!zooplanctonDepthStore.zooplanctonDepthPlotByTimestamp || !range) {
        return [];
    }

    console.log(zooplanctonDepthStore.zooplanctonDepthPlotByTimestamp);

    const samples: DepthSample[] = [];
    for (const [t, values] of Object.entries(
        zooplanctonDepthStore.zooplanctonDepthPlotByTimestamp,
    )) {
        const timestamp = Number(t);
        if (timestamp >= range.start && timestamp < range.end) {
            samples.push({
                timestamp,
                depth: values.y,
            });
        }
    }

    console.log(samples.map((s) => ({ timestamp: new Date(s.timestamp * 1000), depth: s.depth }))); // --- IGNORE ---

    return samples;
});

const questions = [
    {
        id: '01',
        kicker: 'QUESTION',
        title: "Est-ce qu'il est plus proche de la surface vers midi ou vers minuit ?",
    },
];
</script>
