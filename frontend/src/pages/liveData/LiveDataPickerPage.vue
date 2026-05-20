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

    <CardsMenu :items="items" />
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import CardsMenu from 'src/components/CardsMenu.vue';
import type { CardMenuItem } from 'src/components/componentTypes';

const items: CardMenuItem[] = [
    {
        id: '01',
        kicker: 'Air → 100m',
        title: 'Température en profondeur',
        subtitle: '',
        icon: 'device_thermostat',
        color: 'primary',
        textClass: 'text-primary',
        href: '/liveData/temperatureByDepth',
    },
    {
        id: '02',
        kicker: 'Migration jour/nuit',
        title: 'Profondeur du Zooplancton',
        subtitle: '',
        icon: 'water',
        color: 'primary',
        textClass: 'text-primary',
        href: '/liveData/zooplancton',
    },
    {
        id: '03',
        kicker: 'Migration jour/nuit',
        title: 'Concentration de Microalgues',
        subtitle: '',
        icon: 'grass',
        color: 'primary',
        textClass: 'text-primary',
        href: '/liveData/microalgues',
    },
];
</script>

<style scoped>
.back-btn {
    margin-bottom: 2rem;
    border: 1px solid rgb(255 255 255 / 16%);
    background: rgb(255 255 255 / 6%);
}
</style>
