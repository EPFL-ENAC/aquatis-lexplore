import type { LiveDataTab } from 'src/components/TopPageNav.vue';

export const gamesPageGroups: LiveDataTab[] = [
    {
        label: "L'aventure du Plancton",
        icon: 'hiking',
        href: '/games/planctonGame',
    },
    {
        label: 'Chaud ou Froid?',
        icon: 'device_thermostat',
        href: '/games/temperatureOverDepthGame',
    },
];
