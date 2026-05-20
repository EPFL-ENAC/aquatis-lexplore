<template>
    <section class="plot-section">
        <div v-for="row in rows" :key="row.label" class="plot-row">
            <div class="plot-label">
                {{ row.label }}
            </div>

            <div class="plot-track">
                <div class="plot-fill" :style="{ width: `${getWidth(row.value)}%` }" />
                <div class="plot-value" :style="{ left: `calc(${getWidth(row.value)}% + 8px)` }">
                    <span class="plot-value-number">{{ row.value }}</span>
                    <span class="plot-value-unit">°c</span>
                </div>
            </div>
        </div>

        <p class="plot-meta">
            Mesuré aujourd'hui à {{ measuredAt }} ·
            <strong>{{ location }}</strong>
        </p>
    </section>
</template>

<script setup lang="ts">
interface PlotRow {
    label: string;
    value: number;
}

const props = withDefaults(
    defineProps<{
        rows: PlotRow[];
        maxValue?: number;
        measuredAt: string;
        location: string;
    }>(),
    {
        maxValue: 25,
    },
);

const getWidth = (value: number) => {
    return Math.max(0, Math.min((value / props.maxValue) * 100, 100));
};
</script>

<style scoped>
.plot-section {
    margin-top: 2rem;
}

.plot-row {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.plot-label {
    font-size: 1.1rem;
    font-weight: 700;
    text-align: right;
    white-space: nowrap;
}

.plot-track {
    position: relative;
    overflow: hidden;
    height: 2.4rem;
    border: 1px solid rgb(255 255 255 / 8%);
    border-radius: 999px;
    background: linear-gradient(90deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 4%) 100%);
}

.plot-fill {
    height: 100%;
    border-radius: 999px;
    background: #12cfe3;
    box-shadow: 0 0 24px rgb(18 207 227 / 18%) inset;
}

.plot-value {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 0.25rem;
    align-items: baseline;
    white-space: nowrap;
    pointer-events: none;
}

.plot-value-number {
    font-size: 1.15rem;
    font-weight: 800;
    line-height: 1;
}

.plot-value-unit {
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1;
    color: #12cfe3;
}

.plot-meta {
    margin-top: 2rem;
    font-size: 1rem;
    color: rgb(255 255 255 / 56%);
}

@media (max-width: 700px) {
    .plot-row {
        grid-template-columns: 52px 1fr;
        gap: 0.75rem;
    }

    .plot-label {
        font-size: 1rem;
    }

    .plot-track {
        height: 2.2rem;
    }

    .plot-value-number {
        font-size: 1rem;
    }

    .plot-value-unit {
        font-size: 0.8rem;
    }
}
</style>
