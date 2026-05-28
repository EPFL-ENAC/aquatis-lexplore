import type { NavMenuItem } from 'src/navigation/navMenuItem';

export function getGamesNavGroups(t: (key: string) => string): NavMenuItem[] {
    return [
        {
            id: '01',
            shortLabel: t('gameNavPlanctonShort'),
            label: t('gameNavPlanctonTitle'),
            title: t('gameNavPlanctonTitle'),
            subtitle: t('gameNavPlanctonSubtitle'),
            icon: 'water',
            href: '/games/planctonGame',
            color: 'negative',
            actionColor: 'negative',
            textClass: 'text-negative',
        },
        {
            id: '02',
            shortLabel: t('gameNavPlanctonShort'),
            label: t('gameNavTempTitle'),
            title: t('gameNavTempTitle'),
            subtitle: t('gameNavTempSubtitle'),
            icon: 'device_thermostat',
            href: '/games/temperatureOverDepthGame',
            color: 'negative',
            actionColor: 'negative',
            textClass: 'text-negative',
        },
    ];
}
