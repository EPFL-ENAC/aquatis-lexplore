import type { LiveDataTab } from 'src/components/TopPageNav.vue';

export const changesPageGroups: LiveDataTab[] = [
    {
        label: "L'effet du vent sur le lac",
        icon: 'windy',
        href: '/changes/windChange',
    },
    {
        label: 'Est-ce que ça pousse?',
        icon: 'plant',
        href: '/changes/plantGrowth',
    },
];
