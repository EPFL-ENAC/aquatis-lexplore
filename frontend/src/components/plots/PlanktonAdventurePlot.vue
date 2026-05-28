<template>
    <section class="plot-card">
        <svg
            class="plot-svg"
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
            preserveAspectRatio="none"
            :aria-label="t('plotPlanktonAria')"
            role="img"
        >
            <defs>
                <linearGradient id="plankton-plot-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="rgb(255 255 255 / 10%)" />
                    <stop offset="100%" stop-color="rgb(255 255 255 / 2%)" />
                </linearGradient>
            </defs>

            <rect
                x="0"
                y="0"
                width="1000"
                height="600"
                rx="28"
                ry="28"
                fill="url(#plankton-plot-bg)"
            />

            <g v-for="level in levels" :key="level.depth">
                <line
                    :x1="gridLeft"
                    :x2="gridRight"
                    :y1="toSvgY(level.depth)"
                    :y2="toSvgY(level.depth)"
                    class="plot-grid-line"
                />

                <text :x="labelX" :y="toSvgY(level.depth) + 7" class="plot-label">
                    {{ level.label }}
                </text>
            </g>
        </svg>

        <div class="organisms-layer">
            <img
                v-for="organism in organisms"
                :key="organism.id"
                :src="iconSrc"
                alt=""
                aria-hidden="true"
                draggable="false"
                class="organism"
                :style="{
                    left: `${organism.left}%`,
                    top: `${organism.top}%`,
                    width: `${organism.size}px`,
                    transform: `translate(-50%, -50%) rotate(${organism.rotation}deg)`,
                }"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { lerp } from 'src/utils/math';

const { t } = useI18n();

export interface DepthSample {
    timestamp: number;
    depth: number;
}

export interface DepthLevel {
    label: string;
    depth: number;
}

const props = withDefaults(
    defineProps<{
        samples: DepthSample[];
        selectedTimestamp: number;
        iconSrc: string;
        maxDepth?: number;
        count?: number;
    }>(),
    {
        maxDepth: 100,
        count: 10,
    },
);

const levels = computed<DepthLevel[]>(() => [
    { label: t('planktonDepthSurface'), depth: 0 },
    { label: '20m', depth: 20 },
    { label: '50m', depth: 50 },
    { label: '75m', depth: 75 },
    { label: '100m', depth: 100 },
]);

const svgWidth = 1000;
const svgHeight = 600;
const paddingTop = 84;
const paddingRight = 36;
const paddingBottom = 84;
const paddingLeft = 126;

const gridLeft = paddingLeft;
const gridRight = svgWidth - paddingRight;
const labelX = 34;
const plotHeight = svgHeight - paddingTop - paddingBottom;

const toSvgY = (depth: number) => {
    return paddingTop + (depth / props.maxDepth) * plotHeight;
};

const sortedSamples = computed(() => {
    return [...props.samples].sort((a, b) => a.timestamp - b.timestamp);
});

const interpolatedDepth = computed(() => {
    const samples = sortedSamples.value;
    const timestamp = props.selectedTimestamp;

    if (samples.length === 0) {
        return 0;
    }

    if (samples.length === 1 || timestamp <= samples[0]!.timestamp) {
        return samples[0]!.depth;
    }

    const lastSample = samples[samples.length - 1]!;

    if (timestamp >= lastSample.timestamp) {
        return lastSample.depth;
    }

    for (let index = 1; index < samples.length; index += 1) {
        const previous = samples[index - 1]!;
        const next = samples[index]!;

        if (timestamp <= next.timestamp) {
            if (next.timestamp === previous.timestamp) {
                return next.depth;
            }

            const t = (timestamp - previous.timestamp) / (next.timestamp - previous.timestamp);

            return lerp(previous.depth, next.depth, t);
        }
    }

    return lastSample.depth;
});

const xPositions = [18, 27, 36, 45, 54, 63, 72, 81, 90, 97];
const depthOffsets = [-1.2, 0.8, -0.4, 1, -0.8, 0.5, -0.3, 0.9, -1, 0.4];
const rotations = [-12, 8, -10, 11, -9, 9, -8, 10, -11, 7];

const organisms = computed(() => {
    const baseDepth = Math.min(props.maxDepth, Math.max(0, interpolatedDepth.value));

    return xPositions.slice(0, props.count).map((left, index) => {
        const depth = Math.min(props.maxDepth, Math.max(0, baseDepth + depthOffsets[index]!));

        const y = toSvgY(depth);

        return {
            id: `${left}-${index}`,
            left,
            top: (y / svgHeight) * 100,
            size: 34,
            rotation: rotations[index] ?? 0,
        };
    });
});
</script>

<style scoped>
.plot-card {
    overflow: hidden;
    margin-top: 2.5rem;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 28px;
    background: linear-gradient(135deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 2%) 100%);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 6%);
}

.plot-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 1000 / 600;
}

.plot-svg {
    display: block;
    width: 100%;
    height: 100%;
}

.plot-grid-line {
    stroke: rgb(255 255 255 / 16%);
    stroke-width: 1.5;
}

.plot-label {
    font-size: 28px;
    font-weight: 700;
    fill: rgb(255 255 255 / 92%);
}

.organisms-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.organism {
    position: absolute;
    display: block;
    user-select: none;
    transform-origin: center;
    filter: drop-shadow(0 2px 6px rgb(0 0 0 / 18%));
}

@media (max-width: 900px) {
    .plot-card {
        margin-top: 2rem;
        border-radius: 24px;
    }
}
</style>
