<template>
    <div class="temperature-over-depth-heatmap">
        <canvas ref="plotCanvas" />
        <canvas ref="colorBarCanvas" />
    </div>
</template>

<script setup lang="ts">
import { ColorMap } from 'src/utils/colors';
import type { DepthHeatmap } from 'src/utils/depthHeatmap';
import { formatNumber } from 'src/utils/format';
import { HeatmapRaster } from 'src/utils/heatmapRaster';
import { clamp, lerp } from 'src/utils/math';
import { computed, onMounted, ref, watch } from 'vue';

interface Props {
    heatmap: DepthHeatmap | null;
    width?: number;
    height?: number;
    colorBarWidth?: number;
    precision?: number;
    xLabel?: string;
    yLabel?: string;
    zLabel?: string;
    focusWindowCenter?: number | null;
    focusWindowWidth?: number | null;
    plotMargins?: { top: number; right: number; bottom: number; left: number };
}

const props = withDefaults(defineProps<Props>(), {
    width: 760,
    height: 420,
    colorBarWidth: 90,
    precision: 2,
    xLabel: 'X',
    yLabel: 'Depth',
    zLabel: 'Temperature',
    focusWindowCenter: null,
    focusWindowWidth: null,
    plotMargins: () => ({ top: 16, right: 12, bottom: 52, left: 64 }),
});

const plotCanvas = ref<HTMLCanvasElement | null>(null);
const colorBarCanvas = ref<HTMLCanvasElement | null>(null);

const barMargins = {
    top: 16,
    right: 40,
    bottom: 52,
    left: 18,
};

const temperatureColorMap = ColorMap.heat();

const heatmapRaster = new HeatmapRaster(temperatureColorMap);
const extent = computed(() => props.heatmap?.zValuesMinMax());

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

function formatTick(value: number): string {
    const factor = 10 ** props.precision;
    const rounded = Math.round(value * factor) / factor;

    return formatNumber(rounded);
}

function tickStep(length: number, maxLabels = 8): number {
    return Math.max(1, Math.ceil(length / maxLabels));
}

function cellEdges(values: number[]): number[] {
    if (values.length === 0) {
        return [];
    }

    if (values.length === 1) {
        return [values[0]! - 0.5, values[0]! + 0.5];
    }

    const edges: number[] = new Array(values.length + 1);

    edges[0] = values[0]! - (values[1]! - values[0]!) / 2;

    for (let i = 1; i < values.length; i += 1) {
        edges[i] = (values[i - 1]! + values[i]!) / 2;
    }

    edges[values.length] =
        values[values.length - 1]! + (values[values.length - 1]! - values[values.length - 2]!) / 2;

    return edges;
}

function valueToContinuousIndex(values: number[], value: number): number {
    if (values.length === 0) {
        return 0;
    }

    const edges = cellEdges(values);
    const first = edges[0]!;
    const last = edges[edges.length - 1]!;
    const ascending = last >= first;

    if (ascending) {
        if (value <= first) {
            return 0;
        }

        if (value >= last) {
            return values.length;
        }

        for (let i = 0; i < values.length; i += 1) {
            const start = edges[i]!;
            const end = edges[i + 1]!;

            if (value <= end) {
                const span = Math.max(1e-12, end - start);

                return i + (value - start) / span;
            }
        }
    } else {
        if (value >= first) {
            return 0;
        }

        if (value <= last) {
            return values.length;
        }

        for (let i = 0; i < values.length; i += 1) {
            const start = edges[i]!;
            const end = edges[i + 1]!;

            if (value >= end) {
                const span = Math.max(1e-12, start - end);

                return i + (start - value) / span;
            }
        }
    }

    return values.length;
}

function drawEmptyState(): void {
    const canvas = plotCanvas.value;

    if (!canvas) {
        return;
    }

    const ctx = resizeCanvas(canvas, props.width, props.height);

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

function clearColorBar(): void {
    const canvas = colorBarCanvas.value;

    if (!canvas) {
        return;
    }

    const ctx = resizeCanvas(canvas, props.colorBarWidth, props.height);

    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, props.colorBarWidth, props.height);
}

function drawFocusWindowOverlay(
    ctx: CanvasRenderingContext2D,
    xValues: number[],
    plotLeft: number,
    plotTop: number,
    plotWidth: number,
    plotHeight: number,
): void {
    const center = props.focusWindowCenter;
    const width = props.focusWindowWidth;

    if (center == null || width == null || width <= 0 || xValues.length === 0) {
        return;
    }

    const halfWidth = width / 2;
    const startValue = center - halfWidth;
    const endValue = center + halfWidth;

    const startIndex = valueToContinuousIndex(xValues, startValue);
    const endIndex = valueToContinuousIndex(xValues, endValue);

    const focusLeft = plotLeft + Math.min(startIndex, endIndex) * (plotWidth / xValues.length);
    const focusRight = plotLeft + Math.max(startIndex, endIndex) * (plotWidth / xValues.length);

    const clampedLeft = clamp(focusLeft, plotLeft, plotLeft + plotWidth);
    const clampedRight = clamp(focusRight, plotLeft, plotLeft + plotWidth);

    ctx.save();
    ctx.beginPath();
    ctx.rect(plotLeft, plotTop, plotWidth, plotHeight);
    ctx.clip();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

    if (clampedLeft > plotLeft) {
        ctx.fillRect(plotLeft, plotTop, clampedLeft - plotLeft, plotHeight);
    }

    if (clampedRight < plotLeft + plotWidth) {
        ctx.fillRect(clampedRight, plotTop, plotLeft + plotWidth - clampedRight, plotHeight);
    }

    ctx.restore();
}

function drawHeatmap(): void {
    const heatmap = props.heatmap;

    if (!heatmap || heatmap.x.length === 0 || heatmap.y.length === 0) {
        drawEmptyState();
        return;
    }

    if (!extent.value) {
        drawEmptyState();
        return;
    }

    const canvas = plotCanvas.value;

    if (!canvas) {
        return;
    }

    const ctx = resizeCanvas(canvas, props.width, props.height);

    if (!ctx) {
        return;
    }

    const plotLeft = props.plotMargins.left;
    const plotTop = props.plotMargins.top;
    const plotWidth = props.width - props.plotMargins.left - props.plotMargins.right;
    const plotHeight = props.height - props.plotMargins.top - props.plotMargins.bottom;

    ctx.clearRect(0, 0, props.width, props.height);

    heatmapRaster.render(
        heatmap,
        extent.value.min,
        extent.value.max,
        `${heatmap.x.length}:${heatmap.y.length}:${extent.value.min}:${extent.value.max}`,
    );

    heatmapRaster.draw(ctx, plotLeft, plotTop, plotWidth, plotHeight);

    drawFocusWindowOverlay(ctx, heatmap.x, plotLeft, plotTop, plotWidth, plotHeight);

    ctx.fillStyle = '#0f172a';
    ctx.font = '13px "Google Sans Flex", sans-serif';
    ctx.fillStyle = 'white';

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

function drawColorBar(): void {
    const canvas = colorBarCanvas.value;

    if (!canvas) {
        return;
    }

    const ctx = resizeCanvas(canvas, props.colorBarWidth, props.height);

    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, props.colorBarWidth, props.height);

    if (!extent.value) {
        return;
    }

    const barX = barMargins.left;
    const barY = barMargins.top;
    const barWidth = 20;
    const barHeight = props.height - barMargins.top - barMargins.bottom;

    for (let i = 0; i < barHeight; i += 1) {
        const t = 1 - i / Math.max(1, barHeight - 1);

        ctx.fillStyle = temperatureColorMap.toCss(t);
        ctx.fillRect(barX, barY + i, barWidth, 1);
    }

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    const tickCount = 5;
    ctx.fillStyle = '#0f172a';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < tickCount; i += 1) {
        const t = i / (tickCount - 1);
        const y = barY + t * barHeight;
        const value = lerp(extent.value.max, extent.value.min, t);

        ctx.beginPath();
        ctx.moveTo(barX + barWidth, y);
        ctx.lineTo(barX + barWidth + 6, y);
        ctx.stroke();

        ctx.fillText(formatTick(value), barX + barWidth + 10, y);
    }

    ctx.save();
    ctx.translate(barX + barWidth / 2, 4);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '13px sans-serif';
    ctx.fillText(props.zLabel, 0, 0);
    ctx.restore();
}

function drawAll(): void {
    drawHeatmap();

    if (extent.value) {
        drawColorBar();
    } else {
        clearColorBar();
    }
}

onMounted(() => {
    drawAll();
});

watch(
    () => [
        props.heatmap,
        props.width,
        props.height,
        props.colorBarWidth,
        props.precision,
        props.xLabel,
        props.yLabel,
        props.zLabel,
        props.focusWindowCenter,
        props.focusWindowWidth,
    ],
    () => {
        drawAll();
    },
    { immediate: true },
);
</script>

<style scoped>
.temperature-over-depth-heatmap {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

canvas {
    display: block;
}
</style>
