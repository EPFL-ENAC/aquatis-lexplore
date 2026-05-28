export function formatNumber(
    value: number | undefined,
    locale: string | undefined = undefined,
): string {
    if (value === undefined) {
        return 'N/A';
    }

    const numberFormatter = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
    });
    return numberFormatter.format(value);
}

export function formatDate(date: Date, locale: string | undefined = undefined): string {
    const dateFormatter = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    return dateFormatter.format(date);
}

export function formatTime(timestamp: number | undefined, locale: string | undefined): string {
    if (timestamp === undefined) {
        return 'N/A';
    }

    return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Zurich',
    }).format(new Date(timestamp * 1000));
}

export function formatDateShort(timestamp: number | undefined, locale: string | undefined): string {
    if (timestamp === undefined) {
        return 'N/A';
    }

    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'Europe/Zurich',
    }).format(new Date(timestamp * 1000));
}
