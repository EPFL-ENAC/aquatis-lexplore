<template>
    <q-btn
        flat
        rounded
        no-caps
        icon="home"
        :label="t('backToHome')"
        class="back-btn"
        color="white"
        to="/"
    />

    <PageHeader :eyebrow="t('livePickerEyebrow')" :level="1">
        <template #default>
            {{ t('livePickerTitle') }}
        </template>

        <template #subtitle>
            {{ t('livePickerSubtitle') }}
        </template>
    </PageHeader>

    <CardsNavMenu :items="liveDataItems" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from 'src/components/PageHeader.vue';
import CardsNavMenu from 'src/components/CardsNavMenu.vue';
import { getLiveDataItems } from './liveDataNavGroups';

const { t } = useI18n();
const liveDataItems = computed(() => getLiveDataItems(t));
</script>

<style scoped>
.back-btn {
    margin-bottom: 2rem;
    border: 1px solid rgb(255 255 255 / 16%);
    background: rgb(255 255 255 / 6%);
}
</style>
