<template>
    <div class="wind-compact" :style="{ '--size': `${size}px` }">
        <svg
            class="wind-svg"
            viewBox="0 0 100 100"
            role="img"
            :aria-label="`Wind ${cardinalLabel}, ${displaySpeed}`"
        >
            <!-- Outer ring -->
            <circle class="ring ring-main" cx="50" cy="50" r="36" />

            <!-- Cardinal labels -->
            <text class="label label-n" x="50" y="8">N</text>
            <text class="label" x="92" y="50">E</text>
            <text class="label" x="50" y="92">S</text>
            <text class="label" x="8" y="50">W</text>

            <!-- Direction arrow -->
            <g class="arrow-group" :transform="`rotate(${normalizedDeg} 0 0)`">
                <line
                    class="arrow-shaft"
                    x1="50"
                    y1="50"
                    x2="50"
                    :y2="50 - arrowLength + 5"
                    :style="{ strokeWidth: `${arrowStroke}` }"
                />
                <path class="arrow-head" :d="arrowHeadPath" />
            </g>

            <!-- Center dot -->
            <circle class="center-dot" cx="50" cy="50" r="2.8" />
        </svg>

        <div class="wind-meta" v-if="showText">
            <div class="wind-dir">{{ cardinalLabel }}</div>
            <div class="wind-speed">{{ displaySpeed }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    windDirectionDeg: number;
    windSpeed: number;
    size?: number;
    showText?: boolean;
    speedUnit?: string;
    maxVisualSpeed?: number;
}

const props = withDefaults(defineProps<Props>(), {
    size: 96,
    showText: false,
    speedUnit: 'km/h',
    maxVisualSpeed: 30,
});

const normalizedDeg = computed(() => {
    const deg = props.windDirectionDeg % 360;
    return deg < 0 ? deg + 360 : deg;
});

const displaySpeed = computed(() => {
    return `${Math.round(props.windSpeed)} ${props.speedUnit}`;
});

const cardinalLabel = computed(() => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(normalizedDeg.value / 45) % 8;
    return dirs[index];
});

/**
 * Speed mapped to arrow size:
 * slow wind => shorter arrow
 * fast wind => longer + slightly thicker arrow
 */
const speedRatio = computed(() => {
    const ratio = props.windSpeed / props.maxVisualSpeed;
    return Math.max(0.15, Math.min(ratio, 1));
});

const arrowLength = computed(() => {
    return 12 + speedRatio.value * 16;
});

const arrowStroke = computed(() => {
    return 1.8 + speedRatio.value * 1.8;
});

const arrowHeadPath = computed(() => {
    const tipY = 50 - arrowLength.value;
    const baseY = tipY + 7;
    const headHalfWidth = 3.5 + speedRatio.value * 2.5;

    return [
        `M 50 ${tipY}`,
        `L ${50 - headHalfWidth} ${baseY}`,
        `L ${50 + headHalfWidth} ${baseY}`,
        'Z',
    ].join(' ');
});
</script>

<style scoped>
.wind-compact {
    --size: 44px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.92);
}

.wind-svg {
    width: var(--size);
    height: var(--size);
    display: block;
    flex: 0 0 auto;
}

.ring {
    fill: none;
}

.ring-main {
    stroke: rgba(120, 232, 255, 0.34);
    stroke-width: 1.4;
}

.ring-subtle {
    stroke: rgba(120, 232, 255, 0.12);
    stroke-width: 1;
}

.tick {
    stroke-linecap: round;
}

.tick-major {
    stroke: rgba(255, 255, 255, 0.62);
    stroke-width: 1.4;
}

.tick-minor {
    stroke: rgba(255, 255, 255, 0.28);
    stroke-width: 1;
}

.label {
    fill: rgba(255, 255, 255, 0.7);
    font-size: 7px;
    font-weight: 600;
    text-anchor: middle;
    dominant-baseline: middle;
    letter-spacing: 0.08em;
}

.label-n {
    fill: #5fe3ff;
}

.arrow-group {
    transform-origin: 50px 50px;
    transition:
        transform 240ms ease,
        opacity 240ms ease;
}

.arrow-shaft {
    stroke: #5fe3ff;
    stroke-linecap: round;
    transition:
        stroke-width 240ms ease,
        opacity 240ms ease;
}

.arrow-head {
    fill: #5fe3ff;
    transition: d 240ms ease;
}

.center-dot {
    fill: #d8fbff;
    opacity: 0.9;
}

.wind-meta {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
    min-width: 0;
}

.wind-dir {
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
}

.wind-speed {
    font-size: 11px;
    color: #5fe3ff;
    white-space: nowrap;
}
</style>
