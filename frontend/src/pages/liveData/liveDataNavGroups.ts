import type { LiveDataTab } from 'src/components/TopPageNav.vue';

export const liveDataPageGroups: LiveDataTab[] = [
    {
        label: 'Température en profondeur',
        icon: 'thermostat',
        href: '/liveData/temperatureOverDepth',
    },
    {
        label: 'Profondeur du Zooplancton',
        icon: 'water',
        href: '/liveData/zooplanctonDepth',
    },
    {
        label: 'Concentration des microalgues',
        icon: 'grass',
        href: '/liveData/algaeConcentrationOverDepth',
    },
];
