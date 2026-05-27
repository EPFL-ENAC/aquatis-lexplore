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

    <PageHeader eyebrow="01 · LIVE" :level="1">
        <template #default>
            Teste d’autres
            <br />
            données en live!
        </template>

        <template #subtitle>
            Choisis ce que tu veux observer dans le lac. Toutes les valeurs sont mesurées en ce
            moment par la plateforme Léxplore.
        </template>
    </PageHeader>

    <CardsNavMenu :items="liveDataItems" />
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import CardsNavMenu from 'src/components/CardsNavMenu.vue';
import { liveDataItems } from './liveDataNavGroups';
</script>

<style scoped>
.back-btn {
    margin-bottom: 2rem;
    border: 1px solid rgb(255 255 255 / 16%);
    background: rgb(255 255 255 / 6%);
}
</style>
