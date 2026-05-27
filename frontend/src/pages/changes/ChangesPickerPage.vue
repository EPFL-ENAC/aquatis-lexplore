<template>
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

    <PageHeader eyebrow="02 · CHANGEMENTS" eyebrow-class="text-warning" :level="1">
        <template #default>
            Les changements
            <br />
            dans le Léman
        </template>

        <template #subtitle> Choisis ce que tu veux observer dans le lac. </template>
    </PageHeader>

    <CardsNavMenu :items="changePages" :show-id-in-kicker="false" :media-width="128" />
</template>

<script setup lang="ts">
import CardsNavMenu from 'src/components/CardsNavMenu.vue';
import PageHeader from 'src/components/PageHeader.vue';
import { changePages } from './changesNavGroups';
</script>

<style scoped>
.back-btn {
    margin-bottom: 2rem;
    border: 1px solid rgb(255 255 255 / 16%);
    background: rgb(255 255 255 / 6%);
}
</style>
