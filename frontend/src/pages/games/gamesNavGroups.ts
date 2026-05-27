import type { NavMenuItem } from 'src/navigation/navMenuItem';

export const gamesNavGroups: NavMenuItem[] = [
    {
        id: '01',
        shortLabel: 'Migration jour/nuit',
        label: "L'aventure du Plancton",
        title: "L'aventure du Plancton",
        subtitle: 'Suis le zooplancton qui monte et descend dans le lac, heure après heure.',
        icon: 'water',
        href: '/games/planctonGame',
        color: 'negative',
        actionColor: 'negative',
        textClass: 'text-negative',
    },
    {
        id: '02',
        shortLabel: 'Migration jour/nuit',
        label: 'Chaud ou Froid?',
        title: 'Chaud ou Froid?',
        subtitle:
            '3 mois de température, par profondeur. Trouve la zone qui ne se réchauffe jamais.',
        icon: 'device_thermostat',
        href: '/games/temperatureOverDepthGame',
        color: 'negative',
        actionColor: 'negative',
        textClass: 'text-negative',
    },
];
