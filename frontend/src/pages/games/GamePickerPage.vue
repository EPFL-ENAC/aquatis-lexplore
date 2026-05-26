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

            <PageHeader eyebrow="03 · JEUX" :level="1">
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

            <CardsMenu :items="items" :show-id-in-kicker="false" :media-width="128" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import CardsMenu from 'src/components/CardsMenu.vue';
import PageHeader from 'src/components/PageHeader.vue';
import type { CardMenuItem } from 'src/components/componentTypes';

const IMG_PLACEHOLDER = '/epfl.svg';

const items: CardMenuItem[] = [
    {
        id: '01',
        kicker: 'Migration jour/nuit',
        title: "L'aventure du Plancton",
        subtitle: 'Suis le zooplancton qui monte et descend dans le lac, heure après heure.',
        href: '/games/planctonGame',
        color: 'negative',
        actionColor: 'negative',
        textClass: 'text-negative',
        imageSrc: IMG_PLACEHOLDER,
        imageAlt: 'Illustration du plancton',
        imageFit: 'cover',
        mediaBackground: 'linear-gradient(180deg, #2b7d85 0%, #04535d 100%)',
    },
    {
        id: '02',
        kicker: 'Migration jour/nuit',
        title: 'Chaud ou Froid?',
        subtitle:
            '3 mois de température, par profondeur. Trouve la zone qui ne se réchauffe jamais.',
        href: '/games/temperatureOverDepthGame',
        color: 'negative',
        actionColor: 'negative',
        textClass: 'text-negative',
        imageSrc: IMG_PLACEHOLDER,
        imageAlt: 'Illustration du jeu chaud ou froid',
        imageFit: 'cover',
        mediaBackground: 'linear-gradient(180deg, #f78b37 0%, #13b6df 100%)',
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
