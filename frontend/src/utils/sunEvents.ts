import { isLeapYear } from './datetime';
import { clamp, degToRad, radToDeg } from './math';

interface SunEvent {
    timestamp: number;
    type: 'dawn' | 'sunrise' | 'dusk' | 'sunset';
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function getSunEventsBetween(
    tsA: number,
    tsB: number,
    lat: number,
    lon: number,
): SunEvent[] {
    if (!Number.isFinite(tsA) || !Number.isFinite(tsB)) {
        throw new TypeError('Timestamps must be finite numbers (Unix ms).');
    }

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
        throw new RangeError('Latitude must be between -90 and 90.');
    }

    if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
        throw new RangeError('Longitude must be between -180 and 180.');
    }

    const start = Math.min(tsA, tsB);
    const end = Math.max(tsA, tsB);

    const results: SunEvent[] = [];

    // Pad by one UTC day on each side so we don't miss events near boundaries.
    let dayTs = startOfUtcDay(start) - DAY_MS;
    const lastDayTs = startOfUtcDay(end) + DAY_MS;

    for (; dayTs <= lastDayTs; dayTs += DAY_MS) {
        const date = new Date(dayTs);
        const { eqTimeMin, declRad } = solarPositionForUtcDate(date);

        const civil = solarEventMinutesUtc(lat, lon, declRad, eqTimeMin, -6);
        const official = solarEventMinutesUtc(lat, lon, declRad, eqTimeMin, -0.833);

        const candidates: SunEvent[] = [];

        if (civil?.riseMin != null) {
            candidates.push({
                timestamp: dayTs + civil.riseMin * 60_000,
                type: 'dawn',
            });
        }

        if (official?.riseMin != null) {
            candidates.push({
                timestamp: dayTs + official.riseMin * 60_000,
                type: 'sunrise',
            });
        }

        if (official?.setMin != null) {
            candidates.push({
                timestamp: dayTs + official.setMin * 60_000,
                type: 'sunset',
            });
        }

        if (civil?.setMin != null) {
            candidates.push({
                timestamp: dayTs + civil.setMin * 60_000,
                type: 'dusk',
            });
        }

        for (const event of candidates) {
            if (event.timestamp >= start && event.timestamp <= end) {
                results.push(event);
            }
        }
    }

    results.sort((a, b) => a.timestamp - b.timestamp);
    return results;
}

function solarPositionForUtcDate(date: Date): {
    eqTimeMin: number;
    declRad: number;
} {
    const year = date.getUTCFullYear();
    const dayOfYear = getUtcDayOfYear(date);
    const daysInYear = isLeapYear(year) ? 366 : 365;

    // Fractional year, evaluated around noon UTC for the date.
    const gamma = (2 * Math.PI * (dayOfYear - 1 + 0.5)) / daysInYear;

    const eqTimeMin =
        229.18 *
        (0.000075 +
            0.001868 * Math.cos(gamma) -
            0.032077 * Math.sin(gamma) -
            0.014615 * Math.cos(2 * gamma) -
            0.040849 * Math.sin(2 * gamma));

    const declRad =
        0.006918 -
        0.399912 * Math.cos(gamma) +
        0.070257 * Math.sin(gamma) -
        0.006758 * Math.cos(2 * gamma) +
        0.000907 * Math.sin(2 * gamma) -
        0.002697 * Math.cos(3 * gamma) +
        0.00148 * Math.sin(3 * gamma);

    return { eqTimeMin, declRad };
}

function solarEventMinutesUtc(
    latDeg: number,
    lonDeg: number,
    declRad: number,
    eqTimeMin: number,
    solarAltitudeDeg: number,
): { riseMin: number; setMin: number } | null {
    const latRad = degToRad(latDeg);
    const zenithRad = degToRad(90 - solarAltitudeDeg);

    const cosH =
        (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(declRad)) /
        (Math.cos(latRad) * Math.cos(declRad));

    // No event on this date at this latitude (common near poles).
    if (cosH < -1 || cosH > 1) {
        return null;
    }

    const hourAngleRad = Math.acos(clamp(cosH, -1, 1));
    const hourAngleDeg = radToDeg(hourAngleRad);

    // Minutes from 00:00 UTC on this date.
    const solarNoonMin = 720 - 4 * lonDeg - eqTimeMin;

    return {
        riseMin: solarNoonMin - 4 * hourAngleDeg,
        setMin: solarNoonMin + 4 * hourAngleDeg,
    };
}

function startOfUtcDay(timestamp: number): number {
    const d = new Date(timestamp);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function getUtcDayOfYear(date: Date): number {
    const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
    const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

    return Math.floor((today - startOfYear) / DAY_MS);
}

export function makeSunEventsLinearGradient(
    tsA: number,
    tsB: number,
    lat: number,
    lon: number,
    direction = 'to right',
): string {
    const start = Math.min(tsA, tsB);
    const end = Math.max(tsA, tsB);

    if (start === end) {
        return `linear-gradient(${direction}, #0b1020 0%, #0b1020 100%)`;
    }

    const events = getSunEventsBetween(start, end, lat, lon);

    if (events.length === 0) {
        return `linear-gradient(${direction}, #0b1020 0%, #0b1020 100%)`;
    }

    const colorByType: Record<SunEvent['type'], string> = {
        dawn: '#6a8dff',
        sunrise: '#ffd166',
        sunset: '#ff8c42',
        dusk: '#243b6b',
    };

    const startColor = edgeColorBefore(events[0]!.type);
    const endColor = edgeColorAfter(events[events.length - 1]!.type);

    const stops: string[] = [`${startColor} 0%`];

    for (const event of events) {
        const pct = ((event.timestamp - start) / (end - start)) * 100;
        stops.push(`${colorByType[event.type]} ${pct.toFixed(3)}%`);
    }

    stops.push(`${endColor} 100%`);

    return `linear-gradient(${direction}, ${stops.join(', ')})`;
}

function edgeColorBefore(type: SunEvent['type']): string {
    switch (type) {
        case 'dawn':
        case 'sunrise':
            return '#0b1020';
        case 'sunset':
        case 'dusk':
            return '#87ceeb';
    }
}

function edgeColorAfter(type: SunEvent['type']): string {
    switch (type) {
        case 'dawn':
        case 'sunrise':
            return '#87ceeb';
        case 'sunset':
        case 'dusk':
            return '#0b1020';
    }
}
