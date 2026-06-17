<template>
    <section class="timestamp-slider" :style="sliderStyle">
        <div class="slider-track-wrap">
            <div class="slider-track" :style="trackStyle"></div>

            <div class="slider-badge" :style="badgeStyle">
                <div class="slider-badge-time">
                    {{ selectedTopLabel }}
                </div>
                <div class="slider-badge-date">
                    {{ selectedBottomLabel }}
                </div>
            </div>

            <input
                :value="sliderValue"
                :min="minTimestamp"
                :max="maxTimestamp"
                :step="stepSeconds"
                type="range"
                class="slider-input"
                @input="onInput"
            />
        </div>

        <div v-if="props.showTicks" class="slider-labels">
            <span v-for="tick in ticks" :key="tick.timestamp" class="slider-label">
                {{ tick.label }}
            </span>
        </div>

        <div v-if="props.infoText" class="slider-info-text">
            {{ t('sliderInfoText') }}
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDateShort, formatTime } from 'src/utils/format';
import { clamp } from 'src/utils/math';
import { SWITZERLAND_LATITUDE, SWITZERLAND_LONGITUDE } from 'src/utils/countries';
import { toUnixSeconds } from 'src/utils/datetime';
import { getDaynightCyclePeriodsBetween } from 'src/utils/daynightCycle';
import { daynightCyclePeriodsToBands } from 'src/utils/daynightCycleStyle';
import { BackgroundBuilder } from 'src/utils/backgroundBuilder';
import { getSeasonPeriodsBetween } from 'src/utils/seasonsCycle';
import { seasonPeriodsToBands } from 'src/utils/seasonsCycleStyle';

const { locale, t } = useI18n();

const props = withDefaults(
    defineProps<{
        startTimestamp: number;
        endTimestamp: number;
        stepSeconds?: number;
        tickCount?: number;
        dynamicBackground?: 'daynight' | 'seasons' | 'none';
        showTicks?: boolean;
        infoText?: boolean;
    }>(),
    {
        stepSeconds: 60,
        tickCount: 5,
        dynamicBackground: 'daynight',
        showTicks: true,
        infoText: true,
    },
);

const model = defineModel<number>();

const BADGE_SIZE = 76;

const startSeconds = computed(() => {
    return toUnixSeconds(props.startTimestamp) ?? 0;
});

const endSeconds = computed(() => {
    return toUnixSeconds(props.endTimestamp) ?? 0;
});

const minTimestamp = computed(() => {
    return Math.min(startSeconds.value, endSeconds.value);
});

const maxTimestamp = computed(() => {
    return Math.max(startSeconds.value, endSeconds.value);
});

const normalizedTickCount = computed(() => {
    return Math.max(2, Math.round(props.tickCount));
});

function timestampToPercent(timestamp: number) {
    const range = maxTimestamp.value - minTimestamp.value;

    if (range <= 0) {
        return 100;
    }

    return clamp(((timestamp - minTimestamp.value) / range) * 100, 0, 100);
}

watchEffect(() => {
    if (model.value == null) {
        model.value = maxTimestamp.value;
        return;
    }

    model.value = clamp(Math.round(model.value), minTimestamp.value, maxTimestamp.value);
});

const sliderValue = computed(() => {
    return clamp(
        Math.round(model.value ?? maxTimestamp.value),
        minTimestamp.value,
        maxTimestamp.value,
    );
});

const thumbPercent = computed(() => {
    return timestampToPercent(sliderValue.value);
});

const selectedTopLabel = computed(() => {
    if (props.dynamicBackground === 'seasons') {
        return formatDateShort(sliderValue.value, locale.value);
    }
    return formatTime(sliderValue.value, locale.value);
});

const selectedBottomLabel = computed(() => {
    if (props.dynamicBackground === 'seasons') {
        return new Date(sliderValue.value * 1000).getFullYear();
    }

    return formatDateShort(sliderValue.value, locale.value);
});

const trackStyle = computed(() => {
    if (props.dynamicBackground === 'none') {
        return {
            backgroundImage: `linear-gradient(to right, #0b1020 0%, #0b1020 100%)`,
        };
    }

    const backgroundBuilder = new BackgroundBuilder();

    if (props.dynamicBackground === 'seasons') {
        const periods = getSeasonPeriodsBetween(props.startTimestamp, props.endTimestamp, 'north');

        backgroundBuilder.addBand(seasonPeriodsToBands(periods));

        return {
            ...backgroundBuilder.toCSS(props.startTimestamp, props.endTimestamp, {
                iconSizePx: 32,
                minEdgeClearancePct: 5,
            }),
        };
    }

    const periods = getDaynightCyclePeriodsBetween(
        props.startTimestamp,
        props.endTimestamp,
        SWITZERLAND_LATITUDE,
        SWITZERLAND_LONGITUDE,
    );

    backgroundBuilder.addBand(daynightCyclePeriodsToBands(periods));

    return {
        ...backgroundBuilder.toCSS(props.startTimestamp, props.endTimestamp, {
            iconSizePx: 32,
            minEdgeClearancePct: 5,
        }),
    };
});

const badgeStyle = computed(() => {
    return {
        left: `${thumbPercent.value}%`,
    };
});

const sliderStyle = computed(() => {
    return {
        '--badge-size': `${BADGE_SIZE}px`,
    };
});

const ticks = computed(() => {
    if (!props.showTicks) {
        return [];
    }

    const count = normalizedTickCount.value;
    const range = maxTimestamp.value - minTimestamp.value;

    if (range <= 0) {
        return [
            {
                timestamp: minTimestamp.value,
                label: formatTime(minTimestamp.value, locale.value),
            },
        ];
    }

    return Array.from({ length: count }, (_, index) => {
        const ratio = count === 1 ? 0 : index / (count - 1);
        const timestamp = Math.round(minTimestamp.value + range * ratio);

        return {
            timestamp,
            label: formatTime(timestamp, locale.value),
        };
    });
});

function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    model.value = clamp(Math.round(value), minTimestamp.value, maxTimestamp.value);
}
</script>

<style scoped>
.timestamp-slider {
    --vertical-padding: 1rem;
}

.slider-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    padding: 0 var(--vertical-padding);
}

.slider-label {
    font-size: 1rem;
    font-weight: 700;
    color: rgb(255 255 255 / 92%);
}

.slider-track-wrap {
    position: relative;
    padding: 1rem 0;
    overflow-x: visible;
    touch-action: pan-y;
    min-height: 6rem;
}

.slider-track {
    position: relative;
    height: 52px;
    border-radius: 999px;
    box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 12%),
        0 8px 24px rgb(0 0 0 / 18%);
}

.track-icon {
    position: absolute;
    top: 50%;
    font-size: 18px;
    color: rgb(255 208 0 / 70%);
    transform: translate(-50%, -50%);
}

.track-icon--night {
    color: rgb(0 181 215 / 80%);
}

.slider-badge {
    position: absolute;
    top: 4px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: var(--badge-size);
    height: var(--badge-size);
    border: 2px solid white;
    border-radius: 999px;
    background: #ff846d;
    box-shadow: 0 8px 24px rgb(0 0 0 / 25%);
    text-align: center;
    pointer-events: none;
    transform: translateX(-50%);
}

.slider-badge-time {
    font-size: 1.05rem;
    font-weight: 800;
    line-height: 1.05;
}

.slider-badge-date {
    margin-top: 0.25rem;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1;
}

.slider-input {
    position: absolute;
    inset: 0;
    top: var(--vertical-padding);
    width: 100%;
    height: 52px;
    margin: 0;
    background: transparent;
    appearance: none;
    cursor: pointer;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
}

.slider-input::-webkit-slider-runnable-track {
    height: 52px;
    background: transparent;
}

.slider-input::-webkit-slider-thumb {
    width: var(--badge-size);
    height: var(--badge-size);
    border: 0;
    border-radius: 999px;
    background: transparent;
    appearance: none;
}

.slider-input::-moz-range-track {
    height: 52px;
    border: 0;
    border-radius: 999px;
    background: transparent;
}

.slider-input::-moz-range-thumb {
    width: var(--badge-size);
    height: var(--badge-size);
    border: 0;
    border-radius: 999px;
    background: transparent;
}

@media (max-width: 900px) {
    .slider-labels {
        padding: 0 0.5rem;
    }

    .slider-label {
        font-size: 0.9rem;
    }
}
</style>
