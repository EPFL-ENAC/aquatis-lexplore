<template>
    <TopPageNav
        :tabs="changePages"
        active-href="/changes/windChange"
        back-to="/changes"
        back-label="Retour à l'accueil"
    />

    <PageHeader eyebrow="02 · Découverte" eyebrow-class="text-warning" :level="1">
        <template #default> L'effet du vent sur le lac. </template>
    </PageHeader>

    <section class="chart-stage">
        <div class="chart-stage__glow" />

        <div class="chart-card">
            <div class="chart-card__inner">
                <ScrollableTracksChart
                    :timeline="timeline"
                    :px-per-hour="88"
                    :track-height="128"
                    :axis-height="58"
                    :bar-gap="2"
                    :line-stroke-width="3"
                    :locale="locale"
                />
            </div>

            <div class="chart-card__legend">
                <div v-for="track in tracks" :key="track.title" class="chart-card__legend-item">
                    <span
                        class="chart-card__legend-dot"
                        :style="{ backgroundColor: track.color }"
                    />
                    <span>{{ track.title }}</span>
                </div>
            </div>
        </div>
    </section>

    <QuestionCardsRow :items="questions" kickerClass="text-warning" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import ScrollableTracksChart from 'src/components/plots/timeline/ScrollableTrackChart.vue';
import { changePages } from './changesNavGroups';
import { Timeline, Track } from 'src/components/plots/timeline/types';
import { useBuoyStore, useLakeStore, useWeatherStore } from 'src/stores/lexplore';
import { useI18n } from 'vue-i18n';

const weatherStore = useWeatherStore();
const lakeStore = useLakeStore();
const buoyStore = useBuoyStore();

const { locale } = useI18n();

function toMs(timestamp: number): number {
    return timestamp * 1000;
}

const tracks = computed(() => {
    const result: Track[] = [];

    if (weatherStore.data) {
        result.push(
            new Track({
                title: "Température de l'air (°C)",
                type: 'line',
                color: '#ff5e66',
                data: weatherStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: weatherStore.data!.airTemperature[index]!,
                })),
            }),
        );
    }

    if (lakeStore.data) {
        result.push(
            new Track({
                title: "Température de l'eau (°C)",
                type: 'line',
                color: '#4db8ff',
                data: lakeStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: lakeStore.data!.surfaceTemperature[index]!,
                })),
            }),
        );
    }

    if (weatherStore.data) {
        result.push(
            new Track({
                title: 'Vitesse du vent (m/s)',
                type: 'line',
                color: '#7ed957',
                data: weatherStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: weatherStore.data!.windSpeed[index]!,
                })),
            }),
        );
    }

    if (buoyStore.data) {
        result.push(
            new Track({
                title: 'Hauteur des vagues (m)',
                type: 'line',
                color: '#c08cff',
                data: buoyStore.data.timestamps.map((timestamp, index) => ({
                    timestamp: toMs(timestamp),
                    value: buoyStore.data!.height[index]!,
                })),
            }),
        );
    }

    return result;
});

const timeline = computed(() => new Timeline(tracks.value));

const questions = [
    {
        id: '01',
        kicker: 'QUESTION',
        title: 'Observes-tu des changements ces derniers jours ?',
    },
    {
        id: '02',
        kicker: 'QUESTION',
        title: "L'air est-il plus chaud ou plus froid que l'eau ?",
    },
];
</script>

<style scoped>
.chart-stage {
    position: relative;
    margin-top: 8px;
}

.chart-stage__glow {
    position: absolute;
    inset: -24px -8px auto -8px;
    height: 240px;
    background: radial-gradient(
        ellipse at center,
        rgba(18, 201, 220, 0.18) 0%,
        rgba(18, 201, 220, 0.08) 42%,
        transparent 72%
    );
    filter: blur(26px);
    pointer-events: none;
}

.chart-card {
    position: relative;
    border-radius: 24px;
    padding: 28px 24px 22px;
    background:
        linear-gradient(180deg, rgba(72, 175, 186, 0.26), transparent 34%),
        linear-gradient(135deg, rgba(16, 58, 66, 0.95), rgba(7, 21, 29, 0.98));
    border: 1px solid rgba(120, 214, 224, 0.2);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 18px 46px rgba(0, 0, 0, 0.28);
}

.chart-card__inner {
    max-width: 900px;
    margin: 0 auto;
}

.chart-card__legend {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 18px 28px;
}

.chart-card__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.94);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.01em;
}

.chart-card__legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.18);
}

@media (max-width: 900px) {
    .page-shell {
        width: min(100%, calc(100% - 24px));
        padding-top: 18px;
        gap: 22px;
    }

    .chart-card {
        padding: 18px 14px 16px;
        border-radius: 20px;
    }

    .chart-card__legend {
        justify-content: flex-start;
    }
}
</style>
