<template>
    <section class="plot-card">
        <svg
            class="plot-svg"
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
            preserveAspectRatio="none"
            :aria-label="t('plotDepthProfileAria')"
            role="img"
            :style="{ '--svg-width': svgWidth, '--svg-height': svgHeight }"
        >
            <defs>
                <linearGradient id="plot-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="rgb(255 255 255 / 10%)" />
                    <stop offset="100%" stop-color="rgb(255 255 255 / 2%)" />
                </linearGradient>
            </defs>

            <rect
                x="0"
                y="0"
                :width="svgWidth"
                :height="svgHeight"
                rx="28"
                ry="28"
                fill="url(#plot-bg)"
            />

            <g v-for="level in levels" :key="level.label">
                <line
                    :x1="paddingLeft"
                    :x2="gridRight"
                    :y1="toSvgY(level.depth)"
                    :y2="toSvgY(level.depth)"
                    class="plot-grid-line"
                />

                <text :x="labelX" :y="toSvgY(level.depth) + 6" class="plot-label">
                    {{ level.label }}
                </text>
            </g>

            <path :d="curvePath" class="plot-curve" />

            <g v-for="point in normalizedPoints" :key="`${point.x}-${point.y}`">
                <circle :cx="point.x" :cy="point.y" r="5" class="plot-point" />
            </g>
        </svg>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

export interface DepthLevel {
    label: string;
    depth: number;
}

export interface DepthPoint {
    depth: number;
    value: number;
}

const props = withDefaults(
    defineProps<{
        levels: DepthLevel[];
        points: DepthPoint[];
        maxX?: number;
        maxDepth?: number;
    }>(),
    {
        maxX: 100,
        maxDepth: 100,
    },
);

const svgWidth = 1000;
const svgHeight = 800;
const paddingTop = 72;
const paddingRight = 178;
const paddingBottom = 72;
const paddingLeft = 16;

const gridRight = svgWidth - paddingRight;
const labelX = gridRight + 34;
const plotWidth = gridRight - paddingLeft;
const plotHeight = svgHeight - paddingTop - paddingBottom;

const toSvgX = (value: number) => {
    return paddingLeft + (value / props.maxX) * plotWidth;
};

const toSvgY = (depth: number) => {
    return paddingTop + (depth / props.maxDepth) * plotHeight;
};

const normalizedPoints = computed(() =>
    props.points.map((point) => ({
        x: toSvgX(point.value),
        y: toSvgY(point.depth),
    })),
);

const curvePath = computed(() => {
    const pts = normalizedPoints.value;

    if (pts.length === 0) {
        return '';
    }

    if (pts.length === 1) {
        return `M ${pts[0]!.x} ${pts[0]!.y}`;
    }

    if (pts.length === 2) {
        return `M ${pts[0]!.x} ${pts[0]!.y} L ${pts[1]!.x} ${pts[1]!.y}`;
    }

    let path = `M ${pts[0]!.x} ${pts[0]!.y}`;

    for (let i = 0; i < pts.length - 1; i += 1) {
        const p0 = pts[i - 1] ?? pts[i]!;
        const p1 = pts[i]!;
        const p2 = pts[i + 1]!;
        const p3 = pts[i + 2] ?? p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
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

.plot-svg {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: var(--svg-width) / var(--svg-height);
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

.plot-curve {
    fill: none;
    stroke: rgb(220 245 248 / 78%);
    stroke-width: 2.2;
}

.plot-point {
    fill: #11cbe0;
    stroke: white;
    stroke-width: 2;
}

@media (max-width: 900px) {
    .plot-card {
        margin-top: 2rem;
        border-radius: 24px;
    }
}
</style>
