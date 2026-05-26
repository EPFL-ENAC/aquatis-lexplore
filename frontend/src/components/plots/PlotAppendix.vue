<template>
    <p class="plot-meta" v-if="props.measuredAt">
        Mesuré le {{ formatDate(new Date(props.measuredAt * 1000), locale) }} ·
        <strong>{{ location }}</strong>
    </p>
</template>

<script setup lang="ts">
import { formatDate } from 'src/utils/format';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const props = withDefaults(
    defineProps<{
        measuredAt: number | undefined;
        location?: string;
    }>(),
    {
        location: 'Lac Léman',
    },
);
</script>

<style scoped>
.plot-meta {
    margin-top: 2rem;
    font-size: 1rem;
    color: rgb(255 255 255 / 56%);
}
</style>
