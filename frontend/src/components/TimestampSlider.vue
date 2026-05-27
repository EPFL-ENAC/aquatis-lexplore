<template>
    <section class="timestamp-slider">
        <div class="slider-labels">
            <span v-for="tick in ticks" :key="tick.timestamp" class="slider-label">
                {{ tick.label }}
            </span>
        </div>

        <div class="slider-track-wrap">
            <div class="slider-track" :style="trackStyle"></div>

            <div class="slider-badge" :style="badgeStyle">
                <div class="slider-badge-time">
                    {{ selectedTimeLabel }}
                </div>
                <div class="slider-badge-date">
                    {{ selectedDateLabel }}
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
    </section>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDateShort, formatTime } from 'src/utils/format';
import { clamp } from 'src/utils/math';
import { SWITZERLAND_LATITUDE, SWITZERLAND_LONGITUDE } from 'src/utils/countries';
import { makeSunEventsLinearGradient } from 'src/utils/sunEvents';
import { toUnixSeconds } from 'src/utils/datetime';

const { locale } = useI18n();

const props = withDefaults(
    defineProps<{
        startTimestamp: number;
        endTimestamp: number;
        stepSeconds?: number;
        tickCount?: number;
    }>(),
    {
        stepSeconds: 60,
        tickCount: 5,
    },
);

const model = defineModel<number>();

const BADGE_SIZE = 76;
const BADGE_RADIUS = BADGE_SIZE / 2;

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

const selectedTimeLabel = computed(() => {
    return formatTime(sliderValue.value, locale.value);
});

const selectedDateLabel = computed(() => {
    return formatDateShort(sliderValue.value, locale.value);
});

const trackStyle = computed(() => {
    return {
        background: makeSunEventsLinearGradient(
            props.startTimestamp,
            props.endTimestamp,
            SWITZERLAND_LATITUDE,
            SWITZERLAND_LONGITUDE,
        ),
    };
});

const badgeStyle = computed(() => {
    return {
        left: `clamp(${BADGE_RADIUS}px, ${thumbPercent.value}%, calc(100% - ${BADGE_RADIUS}px))`,
    };
});

const ticks = computed(() => {
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
.slider-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 0 1rem;
}

.slider-label {
    font-size: 1rem;
    font-weight: 700;
    color: rgb(255 255 255 / 92%);
}

.slider-track-wrap {
    position: relative;
    padding: 1rem 0;
    overflow-x: hidden;
    touch-action: pan-y;
    min-height: 4rem;
}

.slider-track {
    position: relative;
    height: 52px;
    border-radius: 999px;
    background: linear-gradient(
        90deg,
        #48d4d9 0%,
        #b7d85d 12%,
        #ffd400 28%,
        #ffb347 44%,
        #ff9a76 56%,
        #ffb347 68%,
        #ffd400 80%,
        #94d084 90%,
        #16c7d9 100%
    );
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
    width: 76px;
    height: 76px;
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
    width: 76px;
    height: 76px;
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
    width: 76px;
    height: 76px;
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
