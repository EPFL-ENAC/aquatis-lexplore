export type CardMenuItem = {
    id: string;
    kicker: string;
    title: string;
    subtitle: string;
    icon: string;
    color: 'primary' | 'warning' | 'negative';
    textClass: string;
    href: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
};
