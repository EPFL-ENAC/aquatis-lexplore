import type { NavMenuItem } from 'src/navigation/navMenuItem';

export const liveDataItems: NavMenuItem[] = [
    {
        id: '01',
        shortLabel: 'Air → 100m',
        label: 'Température en profondeur',
        title: 'Température en profondeur',
        subtitle: '',
        icon: 'device_thermostat',
        href: '/liveData/temperatureOverDepth',
        color: 'primary',
        textClass: 'text-primary',
    },
    {
        id: '02',
        shortLabel: 'Migration jour/nuit',
        label: 'Profondeur du Zooplancton',
        title: 'Profondeur du Zooplancton',
        subtitle: '',
        icon: 'water',
        href: '/liveData/zooplanctonDepth',
        color: 'primary',
        textClass: 'text-primary',
    },
    {
        id: '03',
        shortLabel: 'Migration jour/nuit',
        label: 'Concentration des microalgues',
        title: 'Concentration des microalgues',
        subtitle: '',
        icon: 'grass',
        href: '/liveData/algaeConcentrationOverDepth',
        color: 'primary',
        textClass: 'text-primary',
    },
];
