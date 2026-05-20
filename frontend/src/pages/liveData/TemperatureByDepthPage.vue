<template>
    <TopPageNav
        :tabs="[
            {
                label: 'Température en profondeur',
                icon: 'thermostat',
                href: '/liveData/temperatureByDepth',
            },
            {
                label: 'Température de surface',
                icon: 'waves',
                href: '/liveData/surfaceTemperature',
            },
            { label: 'Transparence', icon: 'visibility', href: '/liveData/transparency' },
        ]"
    />

    <PageHeader eyebrow="01 · LIVE - Température en profondeur" :level="1">
        <template #default>
            Plus on descend,
            <br />
            plus l'eau refroidit.
        </template>
    </PageHeader>

    <TemperatureDepthPlot
        :rows="temperatureRows"
        measured-at="13:30"
        location="Lac Léman"
        :max-value="25"
    />

    <QuestionCardsRow :items="questionCards" />
</template>

<script setup lang="ts">
import TopPageNav from 'src/components/TopPageNav.vue';
import PageHeader from 'src/components/PageHeader.vue';
import TemperatureDepthPlot from 'src/components/plots/TemperatureDepthPlot.vue';
import QuestionCardsRow from 'src/components/QuestionCardsRow.vue';

const temperatureRows = [
    { label: 'Air', value: 23 },
    { label: '0m', value: 22 },
    { label: '25m', value: 15 },
    { label: '50m', value: 10 },
    { label: '75m', value: 8 },
    { label: '100m', value: 6 },
];

const questionCards = [
    {
        id: '01',
        kicker: 'QUESTION #1',
        title: "Observes-tu une différence entre l'air et l'eau ?",
    },
    {
        id: '02',
        kicker: 'QUESTION #2',
        title: "Est-ce qu'il fait plus froid à 50 m ou à 100 m ?",
    },
];
</script>

<style scoped></style>
