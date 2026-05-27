<template>
    <div class="timeline-chart__track-title">
        {{ track.title }}
    </div>

    <svg
        class="timeline-chart__track-scale"
        :width="leftGutterWidth"
        :height="trackHeight"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g v-for="tick in valueTicks" :key="tick.value">
            <line
                :x1="leftGutterWidth - 10"
                :x2="leftGutterWidth"
                :y1="tick.y"
                :y2="tick.y"
                class="timeline-chart__value-tick-line"
            />

            <text
                :x="leftGutterWidth - 14"
                :y="tick.y + 4"
                text-anchor="end"
                class="timeline-chart__value-tick-text"
            >
                {{ formatValueTick(tick.value) }}
            </text>
        </g>
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Track } from './types';

const props = withDefaults(
    defineProps<{
        track: Track;
        leftGutterWidth: number;
        trackHeight: number;
        tickCount?: number;
        topMargin?: number;
        bottomMargin?: number;
    }>(),
    {
        tickCount: 5,
        topMargin: 8,
        bottomMargin: 8,
    },
);

const valueTicks = computed(() => {
    const top = props.topMargin;
    const innerHeight = Math.max(1, props.trackHeight - props.topMargin - props.bottomMargin);

    if (props.tickCount <= 1 || props.track.min === props.track.max) {
        return [
            {
                value: props.track.max,
                y: top + innerHeight / 2,
            },
        ];
    }

    return Array.from({ length: props.tickCount }, (_, index) => {
        const ratio = index / (props.tickCount - 1);
        const value = props.track.max - ratio * (props.track.max - props.track.min);
        const y = top + ratio * innerHeight;

        return { value, y };
    });
});

function formatValueTick(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
</script>

<style scoped>
.timeline-chart {
    width: 100%;
}

.timeline-chart__frame {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    border-radius: 12px;
    overflow: hidden;
}

.timeline-chart__left {
    position: sticky;
    left: 0;
    z-index: 2;
    background: inherit;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.timeline-chart__left-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.timeline-chart__left-row {
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.timeline-chart__track-title {
    position: absolute;
    max-width: calc(100% - 64px);
    left: 12px;
    top: 10px;
    right: 12px;
    color: #d8deea;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.2;
    z-index: 1;
}

.timeline-chart__track-scale {
    display: block;
}

.timeline-chart__value-tick-line {
    stroke: rgba(255, 255, 255, 0.3);
    stroke-width: 1;
}

.timeline-chart__value-tick-text {
    fill: rgba(216, 222, 234, 0.75);
    font-size: 11px;
    user-select: none;
}

.timeline-chart__right-scroller {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}

.timeline-chart__plot-stack {
    display: flex;
    flex-direction: column;
}

.timeline-chart__axis-svg {
    display: block;
}

.timeline-chart__axis-line {
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 1;
}

.timeline-chart__axis-text {
    fill: #d8deea;
    font-size: 12px;
    user-select: none;
}

.timeline-chart__axis-time {
    fill: #d8deea;
}

.timeline-chart__axis-date {
    fill: rgba(216, 222, 234, 0.7);
    font-size: 11px;
}
</style>
