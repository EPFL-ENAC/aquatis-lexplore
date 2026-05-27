<template>
    <q-page class="leman-page text-white">
        <div v-if="range" class="page-shell">
            <TopPageNav
                :tabs="gamesNavGroups"
                active-href="/games/planctonGame"
                back-to="/games"
                back-label="Retour"
            />

            <PageHeader
                eyebrow="01 · L'aventure du Plancton"
                eyebrow-class="text-negative"
                :level="1"
            >
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
                :start-timestamp="range.start * 1000"
                :end-timestamp="range.end * 1000"
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
import { gamesNavGroups } from './gamesNavGroups';
import { useZooplanctonDepthStore } from 'src/stores/lexplore';

const zooplanctonDepthStore = useZooplanctonDepthStore();

const selectedTimestamp = ref<number>(Date.now() / 1000);
const range = computed(() => zooplanctonDepthStore.lastFullDayOfDataTimestampRange); // Placeholder range, replace with actual data

const samples = computed(() => {
    if (!zooplanctonDepthStore.zooplanctonDepthPlotByTimestamp || !range.value) {
        return [];
    }

    const samples: DepthSample[] = [];
    for (const [t, values] of Object.entries(
        zooplanctonDepthStore.zooplanctonDepthPlotByTimestamp,
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

const questions = [
    {
        id: '01',
        kicker: 'QUESTION',
        title: "Est-ce qu'il est plus proche de la surface vers midi ou vers minuit ?",
    },
];
</script>
