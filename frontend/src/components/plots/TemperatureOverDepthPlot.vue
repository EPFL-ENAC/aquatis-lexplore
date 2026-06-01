<template>
    <section class="temperature-plot" :style="{ '--depth-plot-axis-x': `${depthAxisX}px` }">
        <div class="temperature-plot__inner">
            <div class="temperature-plot__water-surface" :style="{ top: `${surfaceTopPercent}%` }">
                <div class="temperature-plot__water-wave">
                    <SurfaceWaves />
                </div>
            </div>

            <div class="temperature-plot__plot">
                <div class="temperature-plot__axis" />

                <div
                    v-for="row in positionedRows"
                    :key="row.label"
                    class="temperature-plot__row"
                    :style="{ top: row.top }"
                >
                    <div class="temperature-plot__label">
                        {{ row.label }}
                    </div>

                    <div class="temperature-plot__value">
                        <DynamicThermometer
                            :percent="
                                ((row.value - props.colorMapTemperatureStart) / colorMapRange) * 100
                            "
                            :size="64"
                            :color="temperatureColor(row.value)"
                        />
                        {{ formatTemperature(row.value) }}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ColorMap } from 'src/utils/colors';
import SurfaceWaves from '../SurfaceWaves.vue';
import DynamicThermometer from './DynamicThermometer.vue';

export type TemperatureRow = {
    label: string;
    value: number;
    depth: number;
};

const props = withDefaults(
    defineProps<{
        rows: TemperatureRow[];
        colorMapTemperatureStart?: number;
        colorMapTemperatureEnd?: number;
        colorMap?: ColorMap;
        marginTop?: number;
        marginBottom?: number;
        depthAxisX?: number;
    }>(),
    {
        colorMapTemperatureStart: 0,
        colorMapTemperatureEnd: 25,
        colorMap: () => ColorMap.heat(),
        marginTop: 5,
        marginBottom: 5,
        depthAxisX: 132,
    },
);

const colorMapRange = computed(() => {
    return props.colorMapTemperatureEnd - props.colorMapTemperatureStart;
});

const minDepth = computed(() => {
    return Math.min(...props.rows.map((row) => row.depth));
});

const maxDepth = computed(() => {
    return Math.max(...props.rows.map((row) => row.depth));
});

const minDepthWithMargin = computed(() => minDepth.value - props.marginTop);
const maxDepthWithMargin = computed(() => maxDepth.value + props.marginBottom);

const depthRangeWithMargin = computed(() => {
    return Math.max(1, maxDepthWithMargin.value - minDepthWithMargin.value);
});

const surfaceTopPercent = computed(() => {
    return ((0 - minDepthWithMargin.value) / depthRangeWithMargin.value) * 100;
});

const positionedRows = computed(() => {
    return props.rows.map((row) => {
        const ratio = (row.depth - minDepthWithMargin.value) / depthRangeWithMargin.value;

        return {
            ...row,
            top: `${ratio * 100}%`,
        };
    });
});

function formatTemperature(value: number): string {
    return `${value.toFixed(1)}°C`;
}

function temperatureColor(value: number): string {
    if (colorMapRange.value <= 0) {
        return props.colorMap.toCss(0);
    }

    const t = (value - props.colorMapTemperatureStart) / colorMapRange.value;
    return props.colorMap.toCss(t);
}
</script>

<style scoped>
.temperature-plot {
    padding: 24px 20px;
}

.temperature-plot__inner {
    position: relative;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 28px;
    background:
        linear-gradient(180deg, rgb(255 255 255 / 8%) 0%, rgb(255 255 255 / 4%) 100%),
        linear-gradient(180deg, rgb(0 34 40 / 92%) 0%, rgb(0 22 26 / 98%) 100%);
    backdrop-filter: blur(10px);
}

.temperature-plot__water-surface {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        180deg,
        rgb(120 220 255 / 30%) 0%,
        rgb(32 168 210 / 22%) 35%,
        rgb(20 116 160 / 18%) 65%,
        rgb(8 74 110 / 22%) 100%
    );
    pointer-events: none;
}

.temperature-plot__water-wave {
    position: absolute;
    top: -36px;
    left: 0;
    width: 200%;
    height: 36px;
    color: rgb(120 220 255 / 30%);
    opacity: 0.95;
    filter: drop-shadow(0 -1px 0 rgb(255 255 255 / 14%));
    animation: temperature-plot-wave 9s linear infinite;
}

.temperature-plot__plot {
    position: relative;
    min-height: 90rem;
    padding: 28px;
    z-index: 1;
}

.temperature-plot__axis {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: var(--depth-plot-axis-x);
    width: 6px;
    border-radius: 999px;
    background: rgb(0 0 0 / 80%);
    box-shadow:
        0 0 0 1px rgb(255 255 255 / 6%),
        0 0 20px rgb(0 0 0 / 20%);
}

.temperature-plot__row {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    min-height: 24px;
}

.temperature-plot__label {
    width: var(--depth-plot-axis-x);
    padding: 0 1rem;
    color: rgb(255 255 255 / 88%);
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.01em;
    text-align: right;
}

.temperature-plot__value {
    margin-left: 5rem;
    display: flex;
    align-items: center;
    font-size: 1.9rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
}

@keyframes temperature-plot-wave {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-50%);
    }
}

@media (max-width: 700px) {
    .temperature-plot {
        padding: 16px;
    }

    .temperature-plot__plot {
        min-height: 520px;
        padding: 24px 20px;
    }

    .temperature-plot__axis {
        left: 104px;
    }

    .temperature-plot__label {
        left: 16px;
        width: 72px;
        font-size: 1.15rem;
    }

    .temperature-plot__value {
        left: 154px;
        font-size: 1.35rem;
    }

    .temperature-plot__water-wave {
        top: -26px;
        height: 42px;
    }
}
</style>
