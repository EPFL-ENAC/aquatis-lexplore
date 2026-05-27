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

    <CardsNavMenu :items="items" />

    <QrCode />
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import QrCode from 'src/components/QrCode.vue';
import CardsNavMenu from 'src/components/CardsNavMenu.vue';
import type { NavMenuItem } from 'src/navigation/navMenuItem';

const items: NavMenuItem[] = [
    {
        id: '01',
        shortLabel: 'LIVE',
        label: 'Plus de données en LIVE',
        title: 'Plus de données en LIVE',
        subtitle: 'Température en profondeur, plancton, microalgues mesuré en direct.',
        icon: 'waves',
        href: '/liveData',
        color: 'primary',
        textClass: 'text-primary',
    },
    {
        id: '02',
        shortLabel: 'DÉCOUVERTE',
        label: 'Découvrez les changements du Léman',
        title: 'Découvrez les changements du Léman',
        subtitle: "Comment l'eau, l'air, les vagues ont bougé ces 10 derniers jours.",
        icon: 'show_chart',
        href: '/changes',
        color: 'warning',
        textClass: 'text-warning',
    },
    {
        id: '03',
        shortLabel: 'JEUX',
        label: 'Deviens un Léxplorateur',
        title: 'Deviens un Léxplorateur',
        subtitle: "L'aventure du plancton et Chaud-ou-Froid: deux jeux pour comprendre le lac.",
        icon: 'explore',
        href: '/games',
        color: 'negative',
        textClass: 'text-negative',
    },
];
</script>

<style scoped></style>
