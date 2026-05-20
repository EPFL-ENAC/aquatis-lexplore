<template>
    <PageHeader eyebrow="BIENVENUE" :level="2">
        <template #default>
            Le Léman, en direct,
            <br />
            sous tes yeux.
        </template>

        <template #subtitle>
            Plonge à 100 mètres, suis le plancton heure par heure, et compare l'eau à l'air avec les
            données vraies de la plateforme scientifique Léxplore.
        </template>
    </PageHeader>

    <CardsMenu :items="items" />

    <QrCode />
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import QrCode from 'src/components/QrCode.vue';
import CardsMenu from 'src/components/CardsMenu.vue';
import type { CardMenuItem } from 'src/components/componentTypes';

const items: CardMenuItem[] = [
    {
        id: '01',
        kicker: 'LIVE',
        title: 'Plus de données en LIVE',
        subtitle: 'Température en profondeur, plancton, microalgues mesuré en direct.',
        icon: 'waves',
        color: 'primary',
        textClass: 'text-primary',
        href: '/liveData',
    },
    {
        id: '02',
        kicker: 'DÉCOUVERTE',
        title: 'Découvrez les changements du Léman',
        subtitle: "Comment l'eau, l'air, les vagues ont bougé ces 10 derniers jours.",
        icon: 'show_chart',
        color: 'warning',
        textClass: 'text-warning',
        href: '/decouverte',
    },
    {
        id: '03',
        kicker: 'JEUX',
        title: 'Devient un Léxplorateur',
        subtitle: "L'aventure du plancton et Chaud-ou-Froid: deux jeux pour comprendre le lac.",
        icon: 'explore',
        color: 'negative',
        textClass: 'text-negative',
        href: '/jeux',
    },
];
</script>

<style scoped></style>
