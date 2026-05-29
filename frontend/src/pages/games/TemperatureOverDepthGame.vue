<template>
    <TopPageNav
        :tabs="gamesNavGroups"
        active-href="/games/temperatureOverDepth"
        back-to="/games"
        :back-label="t('back')"
    />

    <PageHeader :eyebrow="t('tempGameEyebrow')" eyebrow-class="text-negative" :level="1">
        <template #default>
            {{ t('tempGameTitle') }}
        </template>

        <template #subtitle> {{ t('tempGameSubtitle') }} </template>
    </PageHeader>

    <template v-if="heatmap">
        <section
            ref="heatmapContainer"
            class="glass-panel heatmap-panel"
            :style="{
                '--plot-margin-left': `${plotMargins.left}px`,
                '--plot-margin-right': `${plotMargins.right}px`,
            }"
        >
            <div ref="heatmapStage" class="heatmap-stage">
                <TemperatureOverDepthHeatmap
                    :heatmap="heatmap"
                    :width="heatmapWidth"
                    :height="280"
                    :color-bar-width="72"
                    x-label=""
                    y-label=""
                    z-label="Temp."
                    :focus-window-center="currentTimestamp"
                    :focus-window-width="focusWindowWidth"
                    :plot-margins="plotMargins"
                />

                <div class="heatmap-axis-mask" />
            </div>

            <div class="timeline-panel">
                <TimestampSlider
                    v-model="currentTimestamp"
                    :start-timestamp="startTimestamp * 1000"
                    :end-timestamp="endTimestamp * 1000"
                />
            </div>
        </section>

        <section class="glass-panel profile-panel">
            <div class="profile-kicker">{{ t('tempGameProfileKicker') }}</div>

            <div class="profile-grid">
                <div
                    v-for="item in temperatureAtReferenceDepths"
                    :key="item.depth"
                    class="profile-item"
                >
                    <div class="profile-depth">{{ item.depth }}m</div>

                    <div class="profile-value">
                        <span class="profile-number">
                            {{ item.value == null ? '\u2014' : item.value.toFixed(1) }}
                        </span>
                        <span v-if="item.value != null" class="profile-unit"> °c </span>
                    </div>
                </div>
            </div>
        </section>

        <QuestionCardsRow :items="questions" />
    </template>

    <section v-else class="glass-panel loading-panel">{{ t('tempGameLoading') }}</section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';
import TemperatureOverDepthHeatmap from 'src/components/plots/TemperatureOverDepthHeatmap.vue';
import TopPageNav from 'src/components/TopPageNav.vue';
import TimestampSlider from 'src/components/TimestampSlider.vue';
import { getGamesNavGroups } from './gamesNavGroups';
import type { DepthHeatmap } from 'src/utils/depthHeatmap';
import { useLakeStore } from 'src/stores/lexplore';

const { t } = useI18n();
const lakeStore = useLakeStore();
const gamesNavGroups = computed(() => getGamesNavGroups(t));

const heatmap = computed<DepthHeatmap | null>(() => {
    return (lakeStore.data?.temperatureOverDepth ?? null) as DepthHeatmap | null;
});

const heatmapContainer = useTemplateRef<HTMLElement>('heatmapContainer');
const sliderIndex = ref(0);

const plotMargins = {
    top: 16,
    right: 12,
    bottom: 52,
    left: 64,
};

const referenceDepths = [0.25, 24, 50, 75, 85];

const heatmapWidth = computed(() => {
    if (!heatmapContainer.value) {
        return 0;
    }

    const containerWidth = heatmapContainer.value?.clientWidth ?? 0;
    const computedStyle = getComputedStyle(heatmapContainer.value);
    const horizontalPadding =
        parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    return Math.max(0, containerWidth - horizontalPadding);
});

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

const startTimestamp = computed(() => (heatmap.value ? Math.min(...heatmap.value.x) : 0));
const endTimestamp = computed(() => {
    return heatmap.value ? Math.max(...heatmap.value.x) : 0;
});
const currentTimestamp = ref(Date.now());

onMounted(() => {
    currentTimestamp.value = (startTimestamp.value + endTimestamp.value) / 2;
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

const temperatureAtReferenceDepths = computed(() => {
    const map = heatmap.value;

    if (!map || map.x.length === 0) {
        return referenceDepths.map((depth) => ({
            depth,
            value: null as number | null,
        }));
    }

    const slice = heatmap.value.slice({
        xStart: currentTimestamp.value - focusWindowWidth.value / 2,
        xEnd: currentTimestamp.value + focusWindowWidth.value / 2,
    });

    if (slice.x.length === 0) {
        return referenceDepths.map((depth) => ({
            depth,
            value: null as number | null,
        }));
    }

    return referenceDepths.map((depth) => ({
        depth,
        value: slice.averageOverTimeAtDepth(depth),
    }));
});

const questions = computed(() => [
    {
        id: '01',
        kicker: `${t('question')} #1`,
        title: t('tempGameQ1'),
    },
    {
        id: '02',
        kicker: `${t('question')} #2`,
        title: t('tempGameQ2'),
    },
]);
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
    left: var(--plot-margin-left, 64px);
    right: var(--plot-margin-right, 12px);
    bottom: 0;
    height: 52px;
    background: #000;
    pointer-events: none;
}

.timeline-panel {
    position: relative;
    margin-left: var(--plot-margin-left, 64px);
    margin-right: var(--plot-margin-right, 12px);
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
