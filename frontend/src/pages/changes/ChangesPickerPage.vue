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

    <PageHeader eyebrow="03 · CHANGEMENTS" :level="1">
        <template #default>
            Les changements
            <br />
            dans le Léman
        </template>

        <template #subtitle> Choisis ce que tu veux observer dans le lac. </template>
    </PageHeader>

    <CardsMenu :items="items" :show-id-in-kicker="false" :media-width="128" />
</template>

<script setup lang="ts">
import CardsMenu from 'src/components/CardsMenu.vue';
import PageHeader from 'src/components/PageHeader.vue';
import type { CardMenuItem } from 'src/components/componentTypes';

const IMG_PLACEHOLDER = '/epfl.svg';

const items: CardMenuItem[] = [
    {
        id: '01',
        kicker: 'Vent',
        title: "L'effet du vent sur le lac",
        subtitle:
            'Découvre comment le vent influence les mouvements de l’eau à la surface du Léman.',
        href: '/changes/windChange',
        color: 'negative',
        actionColor: 'negative',
        textClass: 'text-negative',
        imageSrc: IMG_PLACEHOLDER,
        imageAlt: "Illustration de l'effet du vent sur le lac",
        imageFit: 'cover',
        mediaBackground: 'linear-gradient(180deg, #5aa9e6 0%, #1b4965 100%)',
    },
    {
        id: '02',
        kicker: 'Croissance',
        title: 'Est-ce que ça pousse?',
        subtitle:
            'Observe comment la vie dans le lac évolue et si certains organismes se développent.',
        href: '/changes/plantGrowth',
        color: 'negative',
        actionColor: 'negative',
        textClass: 'text-negative',
        imageSrc: IMG_PLACEHOLDER,
        imageAlt: 'Illustration de la croissance dans le lac',
        imageFit: 'cover',
        mediaBackground: 'linear-gradient(180deg, #7bc96f 0%, #2d6a4f 100%)',
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
