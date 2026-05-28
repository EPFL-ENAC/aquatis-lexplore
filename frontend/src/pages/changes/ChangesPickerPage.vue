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

    <PageHeader :eyebrow="t('changesPickerEyebrow')" eyebrow-class="text-warning" :level="1">
        <template #default>
            {{ t('changesPickerTitle').replace('\n', '') }}
            <br />
            {{ t('changesPickerTitle').split('\n')[1] }}
        </template>

        <template #subtitle> {{ t('changesPickerSubtitle') }} </template>
    </PageHeader>

    <CardsNavMenu :items="changePages" :show-id-in-kicker="false" :media-width="128" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CardsNavMenu from 'src/components/CardsNavMenu.vue';
import PageHeader from 'src/components/PageHeader.vue';
import { getChangePages } from './changesNavGroups';

const { t } = useI18n();
const changePages = computed(() => getChangePages(t));
</script>

<style scoped>
.back-btn {
    margin-bottom: 2rem;
    border: 1px solid rgb(255 255 255 / 16%);
    background: rgb(255 255 255 / 6%);
}
</style>
