<template>
    <g>
        <rect
            v-for="(bar, index) in bars"
            :key="index"
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            :fill="track.color"
            :opacity="0.9"
            rx="1.5"
        />
    </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Track } from './types';
import { clamp } from 'src/utils/math';

const props = withDefaults(
    defineProps<{
        track: Track;
        xForTimestamp: (timestamp: number) => number;
        trackTop: number;
        trackHeight: number;
        gap?: number;
    }>(),
    {
        gap: 2,
    },
);

interface Bar {
    x: number;
    y: number;
    width: number;
    height: number;
}

const bars = computed<Bar[]>(() => {
    const innerTop = props.trackTop + 8;
    const innerHeight = Math.max(1, props.trackHeight - 14);
    const range = Math.max(1, props.track.max - props.track.min);

    return props.track.data.map((point, index) => {
        const nextTimestamp =
            props.track.data[index + 1]?.timestamp ?? point.timestamp + props.track.stepMs;

        const x = props.xForTimestamp(point.timestamp);
        const nextX = props.xForTimestamp(nextTimestamp);
        const width = Math.max(1, nextX - x - props.gap);

        const ratio = clamp((point.value - props.track.min) / range, 0, 1);
        const height = Math.max(1, ratio * innerHeight);
        const y = innerTop + innerHeight - height;

        return {
            x,
            y,
            width,
            height,
        };
    });
});
</script>
