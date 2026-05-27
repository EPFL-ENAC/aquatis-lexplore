import type { NavMenuItem } from 'src/navigation/navMenuItem';

export const changePages: NavMenuItem[] = [
    {
        id: '01',
        shortLabel: 'Vent',
        label: "L'effet du vent sur le lac",
        title: "L'effet du vent sur le lac",
        subtitle:
            'Découvre comment le vent influence les mouvements de l’eau à la surface du Léman.',
        icon: 'air',
        href: '/changes/windChange',
        color: 'warning',
        actionColor: 'warning',
        textClass: 'text-warning',
    },
    {
        id: '02',
        shortLabel: 'Croissance',
        label: 'Est-ce que ça pousse?',
        title: 'Est-ce que ça pousse?',
        subtitle:
            'Observe comment la vie dans le lac évolue et si certains organismes se développent.',
        icon: 'eco',
        href: '/changes/chlorophyllChange',
        color: 'warning',
        actionColor: 'warning',
        textClass: 'text-warning',
    },
];
