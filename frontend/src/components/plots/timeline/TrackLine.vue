<template>
    <g>
        <path
            v-if="pathD"
            :d="pathD"
            :stroke="track.color"
            :stroke-width="strokeWidth"
            fill="none"
            stroke-linejoin="round"
            stroke-linecap="round"
        />

        <circle
            v-if="singlePoint"
            :cx="singlePoint.x"
            :cy="singlePoint.y"
            :r="(strokeWidth ?? 0) + 1"
            :fill="track.color"
        />
    </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Track } from './types';
import { clamp } from 'src/utils/math';

const props = defineProps<{
    track: Track;
    xForTimestamp: (timestamp: number) => number;
    trackTop: number;
    trackHeight: number;
    strokeWidth?: number;
}>();

function yForValue(value: number): number {
    const innerTop = props.trackTop + 8;
    const innerHeight = Math.max(1, props.trackHeight - 16);
    const ratio = clamp(prettyRange.value.normalizedValue(value), 0, 1);

    return innerTop + innerHeight - ratio * innerHeight;
}
const prettyRange = computed(() => props.track.getValueRangePretty());

const pathD = computed(() => {
    if (props.track.data.length === 0) {
        return '';
    }

    return props.track.data
        .map((point, index) => {
            const x = props.xForTimestamp(point.timestamp);
            const y = yForValue(point.value);

            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
});

const singlePoint = computed(() => {
    if (props.track.data.length !== 1) {
        return null;
    }

    const point = props.track.data[0]!;

    return {
        x: props.xForTimestamp(point.timestamp),
        y: yForValue(point.value),
    };
});
</script>
