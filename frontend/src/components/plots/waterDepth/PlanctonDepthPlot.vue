<template>
    <WaterDepthShell
        :rows="rows"
        :margin-top="marginTop"
        :margin-bottom="marginBottom"
        :depth-axis-x="depthAxisX"
    >
        <template #overlay>
            <div class="plankton" :style="{ top: `${planctonTopPercent}%` }">
                <ImageSwarm
                    src="/zooplankton.svg"
                    :count="30"
                    :spread-x="250"
                    :spread-y="planctonSpreadY"
                    distribution="ellipse"
                    :rotation-range="20"
                />
            </div>
        </template>
    </WaterDepthShell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WaterDepthShell from './utils/WaterDepthShell.vue';
import ImageSwarm from './utils/ImageSwarm.vue';

const props = withDefaults(
    defineProps<{
        planctonDepth: number;
        maxDepth: number;
        marginTop?: number;
        marginBottom?: number;
        depthAxisX?: number;
        minDisplayedDepth?: number;
    }>(),
    {
        minDisplayedDepth: 2,
        marginTop: 10,
        marginBottom: 5,
        depthAxisX: 132,
    },
);

const rows = computed(() => {
    const depthFactors = [0, 0.25, 0.5, 0.75, 1];

    return depthFactors.map((factor) => {
        const depth = props.maxDepth * factor;

        return {
            key: depth,
            label: `${depth.toFixed(0)} m`,
            depth,
        };
    });
});

const totalRange = computed(() => props.maxDepth + props.marginTop + props.marginBottom);

const planctonTopPercent = computed(() => {
    const totalDepth = Math.max(props.minDisplayedDepth, props.planctonDepth) + props.marginTop;
    return (totalDepth / totalRange.value) * 100;
});

const planctonSpreadY = computed(() => {
    return props.planctonDepth * 1.5;
});
</script>

<style scoped>
.plankton {
    position: absolute;
    left: 50%;
    filter: drop-shadow(0 0 4px rgb(255 255 255 / 20%));
}
</style>
