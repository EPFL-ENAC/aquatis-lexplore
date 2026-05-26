export function isLeapYear(year: number): boolean {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export const toUnixSeconds = (timestamp?: number) => {
    if (timestamp == null) {
        return undefined;
    }

    return timestamp > 1e12 ? Math.floor(timestamp / 1000) : Math.floor(timestamp);
};
