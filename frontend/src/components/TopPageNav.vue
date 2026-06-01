<template>
    <div class="top-nav">
        <q-btn
            flat
            rounded
            no-caps
            icon="chevron_left"
            :label="displayBackLabel"
            class="back-btn"
            color="white"
            :to="backTo"
        />

        <div class="live-tabs">
            <q-btn
                v-for="tab in tabs"
                :key="tab.href"
                rounded
                no-caps
                :unelevated="tab.href === activeHref"
                :flat="tab.href !== activeHref"
                :icon="tab.icon"
                :label="tab.label"
                :color="tab.href === activeHref ? activeColor : undefined"
                :text-color="tab.href === activeHref ? 'white' : 'white'"
                :class="['live-tab', { active: tab.href === activeHref }]"
                :to="tab.href"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NavMenuItem } from 'src/navigation/navMenuItem';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const activeHref = computed(() => route.path);

const props = withDefaults(
    defineProps<{
        tabs: NavMenuItem[];
        backTo?: string;
        backLabel?: string;
        activeColor?: string;
    }>(),
    {
        backTo: '/liveData',
        backLabel: '',
        activeColor: 'primary',
    },
);

const displayBackLabel = computed(() => props.backLabel || t('back'));
</script>

<style scoped>
.top-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: stretch;
    margin-bottom: 2rem;
}

.back-btn {
    border: 1px solid rgb(255 255 255 / 16%);
    background: rgb(255 255 255 / 6%);
}

.live-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.125rem;
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 999px;
    background: rgb(255 255 255 / 8%);
}

.live-tab {
    min-height: 42px;
    border-radius: 999px;
}

.live-tab:not(.active) {
    background: transparent;
}

@media (max-width: 900px) {
    .live-tabs {
        width: 100%;
        border-radius: 24px;
    }
}
</style>
