import type { NavMenuItem } from 'src/navigation/navMenuItem';

export function getChangePages(t: (key: string) => string): NavMenuItem[] {
    return [
        {
            id: '01',
            shortLabel: t('changesNavWindShort'),
            label: t('changesNavWindTitle'),
            title: t('changesNavWindTitle'),
            subtitle: t('changesNavWindSubtitle'),
            icon: 'air',
            href: '/changes/windChange',
            color: 'warning',
            actionColor: 'warning',
            textClass: 'text-warning',
        },
        {
            id: '02',
            shortLabel: t('changesNavGrowthShort'),
            label: t('changesNavGrowthTitle'),
            title: t('changesNavGrowthTitle'),
            subtitle: t('changesNavGrowthSubtitle'),
            icon: 'eco',
            href: '/changes/chlorophyllChange',
            color: 'warning',
            actionColor: 'warning',
            textClass: 'text-warning',
        },
    ];
}
