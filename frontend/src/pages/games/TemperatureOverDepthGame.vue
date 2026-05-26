<template>
    <div class="page-shell">
        <TopPageNav
            :tabs="gamesPageGroups"
            active-href="/games/temperatureOverDepth"
            back-to="/games"
            back-label="Retour"
        />

        <PageHeader eyebrow="02 · Chaud ou Froid?" :level="1">
            <template #default>
                2 ans de Léman,
                <br />
                par profondeur.
            </template>

            <template #subtitle> Glisse sur la grille pour explorer. </template>
        </PageHeader>

        <template v-if="heatmap">
            <section class="glass-panel heatmap-panel">
                <div ref="heatmapStage" class="heatmap-stage">
                    <TemperatureOverDepthHeatmap
                        :heatmap="heatmap"
                        :width="640"
                        :height="280"
                        :color-bar-width="72"
                        x-label=""
                        y-label=""
                        z-label="Temp."
                        :focus-window-center="selectedX"
                        :focus-window-width="focusWindowWidth"
                    />

                    <div class="heatmap-axis-mask" />

                    <div
                        class="heatmap-hitbox"
                        @pointerdown="onHeatmapPointerDown"
                        @pointermove="onHeatmapPointerMove"
                        @pointerup="onHeatmapPointerUp"
                        @pointercancel="onHeatmapPointerUp"
                        @pointerleave="onHeatmapPointerUp"
                    />
                </div>

                <div class="timeline-panel">
                    <div class="timeline-caption">
                        {{ selectedPeriodLabel }}
                    </div>

                    <q-slider
                        v-model="sliderIndex"
                        class="timeline-slider"
                        :min="0"
                        :max="maxSliderIndex"
                        :step="1"
                        color="cyan-4"
                        track-color="grey-9"
                        selection-color="transparent"
                        thumb-color="cyan-4"
                    />

                    <div class="month-markers">
                        <span
                            v-for="marker in monthMarkers"
                            :key="marker.key"
                            class="month-marker"
                            :style="{ left: `${marker.left}%` }"
                        >
                            {{ marker.label }}
                        </span>
                    </div>
                </div>
            </section>

            <section class="glass-panel profile-panel">
                <div class="profile-kicker">Au curseur → temp par profondeur</div>

                <div class="profile-grid">
                    <div
                        v-for="item in temperatureAtReferenceDepths"
                        :key="item.depth"
                        class="profile-item"
                    >
                        <div class="profile-depth">{{ item.depth }}m</div>

                        <div class="profile-value">
                            <span class="profile-number">
                                {{ item.value == null ? '—' : item.value.toFixed(1) }}
                            </span>
                            <span v-if="item.value != null" class="profile-unit"> °c </span>
                        </div>
                    </div>
                </div>
            </section>

            <QuestionCardsRow :items="questions" />
        </template>

        <section v-else class="glass-panel loading-panel">Chargement des températures…</section>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import TemperatureOverDepthHeatmap from 'src/components/plots/TemperatureOverDepthHeatmap.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import { gamesPageGroups } from './gamesNavGroups';
import type { DepthHeatmap } from 'src/utils/depthHeatmap';
import { lerp } from 'src/utils/math';
import { useLakeStore } from 'src/stores/lexplore';

const lakeStore = useLakeStore();

const heatmap = computed<DepthHeatmap | null>(() => {
    return (lakeStore.data?.temperatureOverDepth ?? null) as DepthHeatmap | null;
});

const sliderIndex = ref(0);
const heatmapStage = ref<HTMLElement | null>(null);
const isScrubbing = ref(false);

const plotMargins = {
    top: 16,
    right: 12,
    bottom: 52,
    left: 64,
};

const referenceDepths = [0, 25, 50, 75, 100];

watch(
    () => heatmap.value?.x.length ?? 0,
    (length) => {
        if (length <= 0) {
            sliderIndex.value = 0;
            return;
        }

        sliderIndex.value = Math.min(Math.max(sliderIndex.value, 0), length - 1);

        if (sliderIndex.value === 0) {
            sliderIndex.value = Math.round((length - 1) * 0.78);
        }
    },
    { immediate: true },
);

const maxSliderIndex = computed(() => {
    return Math.max(0, (heatmap.value?.x.length ?? 1) - 1);
});

const selectedX = computed(() => {
    const xValues = heatmap.value?.x ?? [];

    return xValues[Math.min(sliderIndex.value, xValues.length - 1)] ?? 0;
});

const focusWindowWidth = computed(() => {
    const xValues = heatmap.value?.x ?? [];

    if (xValues.length < 2) {
        return 1;
    }

    let totalStep = 0;

    for (let i = 1; i < xValues.length; i += 1) {
        totalStep += Math.abs(xValues[i]! - xValues[i - 1]!);
    }

    const averageStep = totalStep / (xValues.length - 1);

    return averageStep * 121.25;
});

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function timestampToDate(value: number): Date {
    return new Date(value < 1e12 ? value * 1000 : value);
}

const selectedPeriodLabel = computed(() => {
    if (!heatmap.value || heatmap.value.x.length === 0) {
        return '';
    }

    return new Intl.DateTimeFormat('fr-CH', {
        month: 'long',
        year: 'numeric',
    }).format(timestampToDate(selectedX.value));
});

const monthMarkers = computed(() => {
    const xValues = heatmap.value?.x ?? [];

    if (xValues.length === 0) {
        return [];
    }

    const formatter = new Intl.DateTimeFormat('fr-CH', { month: 'narrow' });
    const markers: Array<{ key: string; label: string; left: number }> = [];
    let previousKey = '';

    for (let i = 0; i < xValues.length; i += 1) {
        const date = timestampToDate(xValues[i]!);
        const key = `${date.getFullYear()}-${date.getMonth()}`;

        if (key === previousKey) {
            continue;
        }

        previousKey = key;

        markers.push({
            key,
            label: formatter.format(date).toUpperCase(),
            left: xValues.length === 1 ? 0 : (i / (xValues.length - 1)) * 100,
        });
    }

    return markers;
});

function interpolateTemperatureAtDepth(
    map: DepthHeatmap,
    xIndex: number,
    targetDepth: number,
): number | null {
    if (map.y.length === 0) {
        return null;
    }

    for (let i = 0; i < map.y.length; i += 1) {
        if (map.y[i] === targetDepth) {
            return map.z.at(xIndex, i) ?? null;
        }
    }

    for (let i = 0; i < map.y.length - 1; i += 1) {
        const y0 = map.y[i]!;
        const y1 = map.y[i + 1]!;
        const minDepth = Math.min(y0, y1);
        const maxDepth = Math.max(y0, y1);

        if (targetDepth < minDepth || targetDepth > maxDepth) {
            continue;
        }

        const v0 = map.z.at(xIndex, i);
        const v1 = map.z.at(xIndex, i + 1);

        if (v0 == null && v1 == null) {
            return null;
        }

        if (v0 == null) {
            return v1 ?? null;
        }

        if (v1 == null) {
            return v0;
        }

        if (y0 === y1) {
            return v0;
        }

        const t = (targetDepth - y0) / (y1 - y0);

        return lerp(v0, v1, t);
    }

    let bestValue: number | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < map.y.length; i += 1) {
        const value = map.z.at(xIndex, i);

        if (value == null) {
            continue;
        }

        const distance = Math.abs(map.y[i]! - targetDepth);

        if (distance < bestDistance) {
            bestDistance = distance;
            bestValue = value;
        }
    }

    return bestValue;
}

const temperatureAtReferenceDepths = computed(() => {
    const map = heatmap.value;

    if (!map || map.x.length === 0) {
        return referenceDepths.map((depth) => ({
            depth,
            value: null as number | null,
        }));
    }

    const xIndex = Math.min(sliderIndex.value, map.x.length - 1);

    return referenceDepths.map((depth) => ({
        depth,
        value: interpolateTemperatureAtDepth(map, xIndex, depth),
    }));
});

function updateSelectionFromClientX(clientX: number): void {
    const map = heatmap.value;
    const stage = heatmapStage.value;

    if (!map || !stage || map.x.length === 0) {
        return;
    }

    const rect = stage.getBoundingClientRect();
    const usableLeft = rect.left + plotMargins.left;
    const usableWidth = rect.width - plotMargins.left - plotMargins.right;

    const t = clamp((clientX - usableLeft) / Math.max(1, usableWidth), 0, 1);

    sliderIndex.value = Math.round(t * (map.x.length - 1));
}

function onHeatmapPointerDown(event: PointerEvent): void {
    isScrubbing.value = true;
    updateSelectionFromClientX(event.clientX);
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
}

function onHeatmapPointerMove(event: PointerEvent): void {
    if (!isScrubbing.value) {
        return;
    }

    updateSelectionFromClientX(event.clientX);
}

function onHeatmapPointerUp(): void {
    isScrubbing.value = false;
}

const questions = [
    {
        id: '01',
        kicker: 'QUESTION #1',
        title: 'Quelle est la période la plus chaude en profondeur?',
    },
    {
        id: '02',
        kicker: 'QUESTION #2',
        title: 'À quelle profondeur l’eau reste toujours plus froide que 10°C?',
    },
];
</script>

<style scoped>
.glass-panel {
    border: 1px solid rgba(166, 233, 238, 0.18);
    border-radius: 22px;
    background: linear-gradient(180deg, rgba(141, 214, 223, 0.18) 0%, rgba(26, 39, 46, 0.22) 100%);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.06),
        0 18px 40px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(8px);
}

.heatmap-panel {
    margin-top: 28px;
    padding: 20px 20px 14px;
}

.heatmap-stage {
    position: relative;
    display: inline-block;
    max-width: 100%;
}

.heatmap-stage :deep(.temperature-over-depth-heatmap) {
    gap: 0;
}

.heatmap-stage :deep(.temperature-over-depth-heatmap canvas:last-child) {
    display: none;
}

.heatmap-axis-mask {
    position: absolute;
    left: 64px;
    right: 12px;
    bottom: 0;
    height: 52px;
    background: #000;
    pointer-events: none;
}

.heatmap-hitbox {
    position: absolute;
    top: 16px;
    right: 12px;
    bottom: 52px;
    left: 64px;
    cursor: ew-resize;
    touch-action: none;
}

.timeline-panel {
    position: relative;
    margin-top: -2px;
    margin-left: 64px;
    margin-right: 12px;
    padding: 10px 12px 6px;
    background: #000;
    border-top: 2px solid rgba(154, 237, 244, 0.75);
}

.timeline-caption {
    margin-bottom: 6px;
    color: rgba(219, 248, 250, 0.8);
    font-size: 12px;
    text-transform: capitalize;
    letter-spacing: 0.02em;
}

.timeline-slider {
    margin: 0 4px 12px;
}

.timeline-panel :deep(.q-slider__track-container) {
    height: 5px;
}

.timeline-panel :deep(.q-slider__track) {
    opacity: 1;
}

.timeline-panel :deep(.q-slider__track-markers) {
    display: none;
}

.timeline-panel :deep(.q-slider__thumb-shape) {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    box-shadow:
        0 0 0 6px rgba(53, 205, 221, 0.2),
        0 8px 18px rgba(0, 0, 0, 0.35);
}

.month-markers {
    position: relative;
    height: 20px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 12px;
    line-height: 20px;
    overflow: hidden;
}

.month-marker {
    position: absolute;
    transform: translateX(-50%);
    white-space: nowrap;
    user-select: none;
}

.profile-panel {
    margin-top: 18px;
    padding: 16px 24px 14px;
}

.profile-kicker {
    color: #ff6d4a;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 14px;
}

.profile-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 16px;
}

.profile-item {
    min-width: 0;
}

.profile-depth {
    margin-bottom: 4px;
    color: rgba(197, 223, 229, 0.72);
    font-size: 13px;
    font-weight: 700;
}

.profile-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
}

.profile-number {
    font-size: 28px;
    line-height: 1;
    font-weight: 800;
}

.profile-unit {
    color: #ff6d4a;
    font-size: 16px;
    font-weight: 700;
    text-transform: lowercase;
}

.loading-panel {
    margin-top: 28px;
    padding: 24px;
    color: rgba(255, 255, 255, 0.76);
    font-size: 16px;
}

@media (max-width: 900px) {
    .profile-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 720px) {
    .page-shell {
        width: min(100%, calc(100% - 20px));
        padding-top: 20px;
    }

    .heatmap-panel {
        padding: 14px 14px 12px;
    }

    .timeline-panel {
        margin-left: 48px;
    }

    .heatmap-axis-mask {
        left: 48px;
    }

    .heatmap-hitbox {
        left: 48px;
    }

    .profile-grid {
        grid-template-columns: 1fr;
    }

    .profile-number {
        font-size: 24px;
    }
}
</style>
