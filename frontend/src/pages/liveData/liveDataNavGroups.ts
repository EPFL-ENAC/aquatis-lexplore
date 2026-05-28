import type { NavMenuItem } from 'src/navigation/navMenuItem';

export function getLiveDataItems(t: (key: string) => string): NavMenuItem[] {
    return [
        {
            id: '01',
            shortLabel: t('liveNavTempDepthShort'),
            label: t('liveNavTempDepth'),
            title: t('liveNavTempDepth'),
            subtitle: '',
            icon: 'device_thermostat',
            href: '/liveData/temperatureOverDepth',
            color: 'primary',
            textClass: 'text-primary',
        },
        {
            id: '02',
            shortLabel: t('liveNavZooDepthShort'),
            label: t('liveNavZooDepth'),
            title: t('liveNavZooDepth'),
            subtitle: '',
            icon: 'water',
            href: '/liveData/zooplanctonDepth',
            color: 'primary',
            textClass: 'text-primary',
        },
        {
            id: '03',
            shortLabel: t('liveNavZooDepthShort'),
            label: t('liveNavAlgaeConc'),
            title: t('liveNavAlgaeConc'),
            subtitle: '',
            icon: 'grass',
            href: '/liveData/algaeConcentrationOverDepth',
            color: 'primary',
            textClass: 'text-primary',
        },
    ];
}
