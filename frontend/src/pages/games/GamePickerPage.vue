<template>
    <q-page class="leman-page text-white">
        <div class="page-shell">
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

            <PageHeader :eyebrow="t('gamePickerEyebrow')" eyebrow-class="text-negative" :level="1">
                <template #default>
                    {{ t('gamePickerTitle') }}
                </template>

                <template #subtitle>
                    {{ t('gamePickerSubtitle') }}
                </template>
            </PageHeader>

            <CardsNavMenu :items="gamesNavGroups" :show-id-in-kicker="false" :media-width="128" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CardsNavMenu from 'src/components/CardsNavMenu.vue';
import PageHeader from 'src/components/PageHeader.vue';
import { getGamesNavGroups } from './gamesNavGroups';

const { t } = useI18n();
const gamesNavGroups = computed(() => getGamesNavGroups(t));
</script>

<style scoped>
.back-btn {
    margin-bottom: 2rem;
    border: 1px solid rgb(255 255 255 / 16%);
    background: rgb(255 255 255 / 6%);
}
</style>
