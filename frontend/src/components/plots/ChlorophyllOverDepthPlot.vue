<template>
    <section class="chlorophyll-plot" :style="{ '--depth-plot-axis-x': `${depthAxisX}px` }">
        <div class="chlorophyll-plot__inner">
            <div class="chlorophyll-plot__water-surface" :style="{ top: `${surfaceTopPercent}%` }">
                <div class="chlorophyll-plot__water-wave">
                    <SurfaceWaves />
                </div>
            </div>

            <div class="chlorophyll-plot__plot">
                <div class="chlorophyll-plot__axis" />

                <div
                    v-for="row in positionedRows"
                    :key="row.label"
                    class="chlorophyll-plot__row"
                    :style="{ top: row.top }"
                >
                    <div class="chlorophyll-plot__label">
                        {{ row.label }}
                    </div>

                    <div class="chlorophyll-plot__value">
                        <div class="chlorophyll-plot__value-number">
                            {{ formatChlorophyll(row.value) }}
                        </div>

                        <ChlorophyllDots
                            :value="row.value"
                            :min="props.valueStart"
                            :max="props.valueEnd"
                            :dot-count="18"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SurfaceWaves from '../SurfaceWaves.vue';
import ChlorophyllDots from './ChlorophyllDots.vue';

export type ChlorophyllRow = {
    label: string;
    value: number;
    depth: number;
};

const props = withDefaults(
    defineProps<{
        rows: ChlorophyllRow[];
        valueStart?: number;
        valueEnd?: number;
        marginTop?: number;
        marginBottom?: number;
        depthAxisX?: number;
        unit?: string;
    }>(),
    {
        valueStart: 0,
        valueEnd: 25,
        marginTop: 10,
        marginBottom: 10,
        depthAxisX: 132,
        unit: 'mg/m³',
    },
);

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

function formatChlorophyll(value: number): string {
    return `${value.toFixed(1)} ${props.unit}`;
}
</script>

<style scoped>
.chlorophyll-plot {
    padding: 24px 20px;
}

.chlorophyll-plot__inner {
    position: relative;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 28px;
    background:
        linear-gradient(180deg, rgb(255 255 255 / 8%) 0%, rgb(255 255 255 / 4%) 100%),
        linear-gradient(180deg, rgb(0 34 40 / 92%) 0%, rgb(0 22 26 / 98%) 100%);
    backdrop-filter: blur(10px);
}

.chlorophyll-plot__water-surface {
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

.chlorophyll-plot__water-wave {
    position: absolute;
    top: -36px;
    left: 0;
    width: 200%;
    height: 36px;
    color: rgb(120 220 255 / 30%);
    opacity: 0.95;
    filter: drop-shadow(0 -1px 0 rgb(255 255 255 / 14%));
    animation: chlorophyll-plot-wave 9s linear infinite;
}

.chlorophyll-plot__plot {
    position: relative;
    min-height: 620px;
    padding: 28px;
    z-index: 1;
}

.chlorophyll-plot__axis {
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

.chlorophyll-plot__row {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    min-height: 24px;
}

.chlorophyll-plot__label {
    width: var(--depth-plot-axis-x);
    padding: 0 1rem;
    color: rgb(255 255 255 / 88%);
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.01em;
    text-align: right;
}

.chlorophyll-plot__value {
    margin-left: 5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
}

.chlorophyll-plot__value-number {
    min-width: 7.5rem;
    color: rgb(235 255 240 / 95%);
    white-space: nowrap;
}

@keyframes chlorophyll-plot-wave {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-50%);
    }
}

@media (max-width: 700px) {
    .chlorophyll-plot {
        padding: 16px;
    }

    .chlorophyll-plot__plot {
        min-height: 520px;
        padding: 24px 20px;
    }

    .chlorophyll-plot__axis {
        left: 104px;
    }

    .chlorophyll-plot__label {
        width: 72px;
        font-size: 1.15rem;
    }

    .chlorophyll-plot__value {
        margin-left: 3rem;
        gap: 0.75rem;
        font-size: 1rem;
    }

    .chlorophyll-plot__value-number {
        min-width: 6.5rem;
    }

    .chlorophyll-plot__water-wave {
        top: -26px;
        height: 42px;
    }
}
</style>
