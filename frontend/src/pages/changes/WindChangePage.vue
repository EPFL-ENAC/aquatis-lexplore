<template>
    <TopPageNav
        :tabs="changesPageGroups"
        active-href="/changes/windChange"
        back-to="/changes"
        back-label="Retour à l'accueil"
    />

    <PageHeader eyebrow="02 · Découverte" :level="1">
        <template #default> L'effet du vent sur le lac. </template>
    </PageHeader>

    <section class="chart-stage">
        <div class="chart-stage__glow" />

        <div class="chart-card">
            <div class="chart-card__inner">
                <ScrollableTracksChart
                    :timeline="timeline"
                    :px-per-hour="88"
                    :track-height="88"
                    :axis-height="58"
                    :bar-gap="2"
                    :line-stroke-width="3"
                    :track-colors="trackColors"
                    locale="fr-CH"
                />
            </div>

            <div class="chart-card__legend">
                <div v-for="item in chartLegend" :key="item.label" class="chart-card__legend-item">
                    <span class="chart-card__legend-dot" :style="{ backgroundColor: item.color }" />
                    <span>{{ item.label }}</span>
                </div>
            </div>
        </div>
    </section>

    <QuestionCardsRow :items="questions" />
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import ScrollableTracksChart from 'src/components/plots/timeline/ScrollableTrackChart.vue';
import { changesPageGroups } from './changesNavGroups';
import { Timeline, Track } from 'src/components/plots/timeline/types';

const base = new Date(2026, 4, 27, 0, 0, 0).getTime();

function h(hours: number): number {
    return base + hours * 60 * 60 * 1000;
}

const trackColors = ['#4db8ff', '#b58f1b', '#ff5e66'];

const chartLegend = [
    {
        label: 'Hauteur des vagues',
        color: '#4db8ff',
    },
    {
        label: 'Quantité de pluie',
        color: '#b58f1b',
    },
    {
        label: "Température de l'air",
        color: '#ff5e66',
    },
];

const tracks: Track[] = [
    new Track({
        title: 'Hauteur des vagues (m)',
        type: 'bar',
        data: [
            { timestamp: h(-6), value: 0.4 },
            { timestamp: h(-5), value: 0.5 },
            { timestamp: h(-4), value: 0.7 },
            { timestamp: h(-3), value: 0.9 },
            { timestamp: h(-2), value: 1.1 },
            { timestamp: h(-1), value: 1.0 },
            { timestamp: h(0), value: 0.8 },
            { timestamp: h(1), value: 0.6 },
            { timestamp: h(2), value: 0.5 },
            { timestamp: h(3), value: 0.4 },
            { timestamp: h(4), value: 0.4 },
            { timestamp: h(5), value: 0.6 },
            { timestamp: h(6), value: 0.8 },
            { timestamp: h(7), value: 1.0 },
            { timestamp: h(8), value: 1.2 },
            { timestamp: h(9), value: 1.1 },
            { timestamp: h(10), value: 0.9 },
            { timestamp: h(11), value: 0.8 },
            { timestamp: h(12), value: 0.7 },
            { timestamp: h(13), value: 0.6 },
            { timestamp: h(14), value: 0.6 },
            { timestamp: h(15), value: 0.7 },
            { timestamp: h(16), value: 0.9 },
            { timestamp: h(17), value: 1.0 },
            { timestamp: h(18), value: 1.1 },
            { timestamp: h(19), value: 1.0 },
            { timestamp: h(20), value: 0.8 },
            { timestamp: h(21), value: 0.7 },
            { timestamp: h(22), value: 0.6 },
            { timestamp: h(23), value: 0.5 },
            { timestamp: h(24), value: 0.4 },
            { timestamp: h(25), value: 0.5 },
            { timestamp: h(26), value: 0.7 },
            { timestamp: h(27), value: 0.9 },
            { timestamp: h(28), value: 1.0 },
            { timestamp: h(29), value: 1.1 },
            { timestamp: h(30), value: 0.9 },
        ],
    }),
    new Track({
        title: 'Quantité de pluie (mm)',
        type: 'bar',
        data: [
            { timestamp: h(-6), value: 3 },
            { timestamp: h(-5), value: 8 },
            { timestamp: h(-4), value: 14 },
            { timestamp: h(-3), value: 20 },
            { timestamp: h(-2), value: 18 },
            { timestamp: h(-1), value: 12 },
            { timestamp: h(0), value: 4 },
            { timestamp: h(1), value: 0 },
            { timestamp: h(2), value: 0 },
            { timestamp: h(3), value: 0 },
            { timestamp: h(4), value: 0 },
            { timestamp: h(5), value: 2 },
            { timestamp: h(6), value: 10 },
            { timestamp: h(7), value: 16 },
            { timestamp: h(8), value: 22 },
            { timestamp: h(9), value: 24 },
            { timestamp: h(10), value: 21 },
            { timestamp: h(11), value: 15 },
            { timestamp: h(12), value: 8 },
            { timestamp: h(13), value: 3 },
            { timestamp: h(14), value: 0 },
            { timestamp: h(15), value: 0 },
            { timestamp: h(16), value: 0 },
            { timestamp: h(17), value: 5 },
            { timestamp: h(18), value: 12 },
            { timestamp: h(19), value: 18 },
            { timestamp: h(20), value: 20 },
            { timestamp: h(21), value: 19 },
            { timestamp: h(22), value: 12 },
            { timestamp: h(23), value: 6 },
            { timestamp: h(24), value: 1 },
            { timestamp: h(25), value: 0 },
            { timestamp: h(26), value: 0 },
            { timestamp: h(27), value: 0 },
            { timestamp: h(28), value: 4 },
            { timestamp: h(29), value: 9 },
            { timestamp: h(30), value: 14 },
        ],
    }),
    new Track({
        title: "Température de l'air (°C)",
        type: 'line',
        data: [
            { timestamp: h(-6), value: 28.5 },
            { timestamp: h(-5), value: 29.4 },
            { timestamp: h(-4), value: 30.2 },
            { timestamp: h(-3), value: 30.5 },
            { timestamp: h(-2), value: 29.1 },
            { timestamp: h(-1), value: 27.8 },
            { timestamp: h(0), value: 25.4 },
            { timestamp: h(1), value: 22.8 },
            { timestamp: h(2), value: 20.4 },
            { timestamp: h(3), value: 18.5 },
            { timestamp: h(4), value: 17.1 },
            { timestamp: h(5), value: 16.4 },
            { timestamp: h(6), value: 17.0 },
            { timestamp: h(7), value: 18.7 },
            { timestamp: h(8), value: 21.4 },
            { timestamp: h(9), value: 24.9 },
            { timestamp: h(10), value: 27.8 },
            { timestamp: h(11), value: 30.0 },
            { timestamp: h(12), value: 31.4 },
            { timestamp: h(13), value: 32.2 },
            { timestamp: h(14), value: 32.0 },
            { timestamp: h(15), value: 31.1 },
            { timestamp: h(16), value: 29.2 },
            { timestamp: h(17), value: 26.7 },
            { timestamp: h(18), value: 23.5 },
            { timestamp: h(19), value: 20.2 },
            { timestamp: h(20), value: 17.4 },
            { timestamp: h(21), value: 15.5 },
            { timestamp: h(22), value: 14.7 },
            { timestamp: h(23), value: 14.8 },
            { timestamp: h(24), value: 16.0 },
            { timestamp: h(25), value: 18.6 },
            { timestamp: h(26), value: 21.9 },
            { timestamp: h(27), value: 25.1 },
            { timestamp: h(28), value: 28.0 },
            { timestamp: h(29), value: 30.1 },
            { timestamp: h(30), value: 31.3 },
        ],
    }),
];

const timeline = new Timeline(tracks);

const questions = [
    {
        id: '01',
        kicker: 'QUESTION',
        title: "Est-ce plus chaud ou plus froid que l'eau",
    },
    {
        id: '02',
        kicker: 'QUESTION',
        title: 'À quelle profondeur vois-tu le plancton maintenant ?',
    },
    {
        id: '03',
        kicker: 'QUESTION',
        title: "Est-ce que l'eau du lac se refroidit avec la pluie ?",
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
