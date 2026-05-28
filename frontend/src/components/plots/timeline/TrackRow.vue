<template>
    <svg
        :width="width"
        :height="height"
        class="timeline-chart__row-svg"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g>
            <line
                v-for="tick in ticks"
                :key="`grid-${tick.timestamp}`"
                :x1="xForTimestamp(tick.timestamp)"
                :x2="xForTimestamp(tick.timestamp)"
                y1="0"
                :y2="height"
                :class="[
                    'timeline-chart__vertical-grid',
                    tick.isDayStart && 'timeline-chart__vertical-grid--strong',
                ]"
            />

            <line
                x1="0"
                :x2="width"
                :y1="height - 0.5"
                :y2="height - 0.5"
                class="timeline-chart__row-line"
            />
        </g>

        <TrackBars
            v-if="track.type === 'bar'"
            :track="track"
            :x-for-timestamp="xForTimestamp"
            :track-top="0"
            :track-height="height"
            :gap="barGap"
        />

        <TrackLine
            v-else-if="track.type === 'line'"
            :track="track"
            :x-for-timestamp="xForTimestamp"
            :track-top="0"
            :track-height="height"
            :stroke-width="lineStrokeWidth"
        />

        <TrackWind
            v-else-if="track.type === 'wind'"
            :track="track"
            :x-for-timestamp="xForTimestamp"
            :track-top="0"
            :track-height="height"
            :gap="barGap"
        />
    </svg>
</template>

<script setup lang="ts">
import TrackBars from './TrackBars.vue';
import TrackWind from './TrackWind.vue';
import TrackLine from './TrackLine.vue';
import type { TimelineTick, Track } from './types';

defineProps<{
    track: Track;
    width: number;
    height: number;
    ticks: TimelineTick[];
    xForTimestamp: (timestamp: number) => number;
    barGap: number;
    lineStrokeWidth: number;
}>();
</script>

<style scoped>
.timeline-chart__row-svg {
    display: block;
}

.timeline-chart__vertical-grid {
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 1;
}

.timeline-chart__vertical-grid--strong {
    stroke: rgba(255, 255, 255, 0.22);
}

.timeline-chart__row-line {
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1;
}
</style>
