<template>
    <div class="temperature-over-depth-heatmap">
        <div class="color-bar-container">
            <div class="color-bar" :style="{ '--gradient': colorBarGradient }"></div>
            <div class="min-max" v-if="minMax">
                <span class="min">{{ formatNumber(minMax.min, locale) }} {{ props.unit }}</span>
                <span class="max">{{ formatNumber(minMax.max, locale) }} {{ props.unit }}</span>
            </div>
        </div>

        <div
            class="plot-container"
            :style="{ width: `${props.width}px`, height: `${props.height}px` }"
        >
            <canvas ref="plotCanvas" />

            <div
                v-if="focusOverlay.visible"
                class="focus-overlay"
                :style="{
                    left: `${plotBounds.left}px`,
                    top: `${plotBounds.top}px`,
                    width: `${plotBounds.width}px`,
                    height: `${plotBounds.height}px`,
                }"
            >
                <div
                    class="focus-band"
                    :style="{
                        left: `${focusOverlay.bandLeft}px`,
                        top: '0px',
                        width: `${focusOverlay.bandWidth}px`,
                        height: `${plotBounds.height}px`,
                        background: props.focusWindowColor,
                        opacity: props.focusWindowOpacity,
                    }"
                />
            </div>
        </div>

        <div class="processing-overlay" v-if="loading">
            <q-circular-progress indeterminate rounded size="50px" color="white" class="q-ma-md" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ColorMap } from 'src/utils/colors';
import type { DepthHeatmap } from 'src/utils/depthHeatmap';
import { formatNumber } from 'src/utils/format';
import { HeatmapRaster } from 'src/utils/heatmapRaster';
import { clamp } from 'src/utils/math';
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
    heatmap: DepthHeatmap | null;
    width?: number;
    height?: number;
    precision?: number;
    xLabel?: string;
    yLabel?: string;
    zLabel?: string;
    unit?: string;
    focusWindowCenter?: number | null;
    focusWindowWidth?: number | null;
    focusWindowColor?: string;
    focusWindowOpacity?: number;
    plotMargins?: { top: number; right: number; bottom: number; left: number };
}

const props = withDefaults(defineProps<Props>(), {
    width: 760,
    height: 420,
    precision: 2,
    xLabel: 'X',
    yLabel: 'Depth',
    zLabel: 'Temperature',
    unit: '°C',
    focusWindowCenter: null,
    focusWindowWidth: null,
    focusWindowColor: '#3b82f6',
    focusWindowOpacity: 0.25,
    plotMargins: () => ({ top: 16, right: 12, bottom: 16, left: 64 }),
});

const { locale } = useI18n();

const plotCanvas = ref<HTMLCanvasElement | null>(null);
const loading = ref(true);
const minMax = ref<{ min: number; max: number } | null>(null);

const temperatureColorMap = ColorMap.heat();
const heatmapRaster = new HeatmapRaster(temperatureColorMap);

const colorBarGradient = computed(() => temperatureColorMap.toCssGradient());

const plotBounds = computed(() => ({
    left: props.plotMargins.left,
    top: props.plotMargins.top,
    width: props.width - props.plotMargins.left - props.plotMargins.right,
    height: props.height - props.plotMargins.top - props.plotMargins.bottom,
}));

function resizeCanvas(
    canvas: HTMLCanvasElement,
    cssWidth: number,
    cssHeight: number,
): CanvasRenderingContext2D | null {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.round(cssWidth * dpr));
    canvas.height = Math.max(1, Math.round(cssHeight * dpr));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return ctx;
}

function getPlotContext(): CanvasRenderingContext2D | null {
    const canvas = plotCanvas.value;

    if (!canvas) {
        return null;
    }

    return canvas.getContext('2d');
}

function formatTick(value: number): string {
    const factor = 10 ** props.precision;
    const rounded = Math.round(value * factor) / factor;

    return formatNumber(rounded);
}

function tickStep(length: number, maxLabels = 8): number {
    return Math.max(1, Math.ceil(length / maxLabels));
}

const focusOverlay = computed(() => {
    const heatmap = props.heatmap;
    const center = props.focusWindowCenter;
    const width = props.focusWindowWidth;
    const { width: plotWidth } = plotBounds.value;

    if (
        !heatmap ||
        heatmap.x.length === 0 ||
        center == null ||
        width == null ||
        width <= 0 ||
        plotWidth <= 0
    ) {
        return {
            visible: false,
            bandLeft: 0,
            bandWidth: 0,
        };
    }

    const halfWidth = width / 2;
    const startValue = center - halfWidth;
    const endValue = center + halfWidth;

    const startIndex = heatmap.xValueToContinuousIndex(startValue);
    const endIndex = heatmap.xValueToContinuousIndex(endValue);

    const focusLeft = Math.min(startIndex, endIndex) * (plotWidth / heatmap.x.length);
    const focusRight = Math.max(startIndex, endIndex) * (plotWidth / heatmap.x.length);

    const clampedLeft = clamp(focusLeft, 0, plotWidth);
    const clampedRight = clamp(focusRight, 0, plotWidth);

    return {
        visible: clampedRight > clampedLeft,
        bandLeft: clampedLeft,
        bandWidth: Math.max(0, clampedRight - clampedLeft),
    };
});

function drawEmptyState(): void {
    const ctx = getPlotContext();

    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, props.width, props.height);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No heatmap data', props.width / 2, props.height / 2);
}

function drawHeatmap(): void {
    const heatmap = props.heatmap;

    if (!heatmap || heatmap.x.length === 0 || heatmap.y.length === 0) {
        drawEmptyState();
        return;
    }

    console.time('minmax');
    const extent = props.heatmap?.zValuesMinMax();
    console.timeEnd('minmax');
    if (!extent) {
        drawEmptyState();
        return;
    }
    minMax.value = extent;

    const ctx = getPlotContext();
    if (!ctx) {
        return;
    }

    const { left: plotLeft, top: plotTop, width: plotWidth, height: plotHeight } = plotBounds.value;

    ctx.clearRect(0, 0, props.width, props.height);

    heatmapRaster.render(
        heatmap,
        extent.min,
        extent.max,
        `${heatmap.x.length}:${heatmap.y.length}:${extent.min}:${extent.max}`,
    );

    heatmapRaster.draw(ctx, plotLeft, plotTop, plotWidth, plotHeight);

    ctx.fillStyle = 'white';
    ctx.font = '13px "Google Sans Flex", sans-serif';

    const cellHeight = plotHeight / heatmap.y.length;

    const yStep = tickStep(heatmap.y.length, 8);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let y = 0; y < heatmap.y.length; y += yStep) {
        const centerY = plotTop + (y + 0.5) * cellHeight;
        const label = formatTick(heatmap.y[y]!);

        ctx.fillText(label, plotLeft - 8, centerY);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = '13px "Google Sans Flex", sans-serif';
    ctx.fillText(props.xLabel, plotLeft + plotWidth / 2, props.height - 6);

    ctx.save();
    ctx.translate(16, plotTop + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(props.yLabel, 0, 0);
    ctx.restore();
}

function resizeCanvases(): void {
    if (plotCanvas.value) {
        resizeCanvas(plotCanvas.value, props.width, props.height);
    }
}

function redrawPlot(): Promise<void> {
    loading.value = true;

    function wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return wait(10)
        .then(() => {
            drawHeatmap();
        })
        .finally(() => {
            loading.value = false;
        });
}

watch(
    () => [props.width, props.height],
    async () => {
        await nextTick();
        resizeCanvases();
        return await redrawPlot();
    },
);

watch(
    () => [
        props.heatmap,
        props.precision,
        props.xLabel,
        props.yLabel,
        props.zLabel,
        props.plotMargins.top,
        props.plotMargins.right,
        props.plotMargins.bottom,
        props.plotMargins.left,
    ],
    async () => {
        return await redrawPlot();
    },
    { deep: true },
);
</script>

<style scoped>
.temperature-over-depth-heatmap {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.plot-container {
    position: relative;
    flex: 0 0 auto;
}

canvas {
    display: block;
}

.focus-overlay {
    position: absolute;
    pointer-events: none;
}

.focus-band {
    position: absolute;
}

.processing-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
}

.color-bar-container {
    width: 50%;
    margin-left: auto;
}

.color-bar {
    height: 2rem;
    background: var(--gradient);
    border-radius: 1rem;
}

.min-max {
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;
    color: white;
}
</style>
