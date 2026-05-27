<template>
    <q-page class="leman-page text-white">
        <div class="page-shell">
            <q-btn
                flat
                rounded
                no-caps
                icon="home"
                label="Retour à l’accueil"
                class="back-btn"
                color="white"
                to="/"
            />

            <PageHeader eyebrow="03 · JEUX" eyebrow-class="text-negative" :level="1">
                <template #default>
                    Jeu sur la vie
                    <br />
                    dans le Léman
                </template>

                <template #subtitle>
                    Choisis ce que tu veux observer dans le lac. Toutes les valeurs sont mesurées en
                    ce moment par la plateforme Léxplore.
                </template>
            </PageHeader>

            <CardsNavMenu :items="gamesNavGroups" :show-id-in-kicker="false" :media-width="128" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import CardsNavMenu from 'src/components/CardsNavMenu.vue';
import PageHeader from 'src/components/PageHeader.vue';
import { gamesNavGroups } from './gamesNavGroups';
</script>

<style scoped>
.back-btn {
    margin-bottom: 2rem;
    border: 1px solid rgb(255 255 255 / 16%);
    background: rgb(255 255 255 / 6%);
}
</style>
