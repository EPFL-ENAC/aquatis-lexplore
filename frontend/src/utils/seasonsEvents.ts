interface SeasonEvent {
    timestamp: number;
    type: 'spring' | 'summer' | 'autumn' | 'winter';
}

type Hemisphere = 'north' | 'south';

type BackgroundStyle = {
    backgroundImage: string;
    backgroundPosition: string;
    backgroundRepeat: string;
    backgroundSize: string;
};

const displayPropertyBySeason: Record<SeasonEvent['type'], { color: string; icon: string }> = {
    spring: {
        color: '#7bc96f',
        icon: `url("/icons/flower.svg")`,
    },
    summer: {
        color: '#ffd166',
        icon: `url("/icons/sun.svg")`,
    },
    autumn: {
        color: '#d98b3a',
        icon: `url("/icons/pumpkin2.svg")`,
    },
    winter: {
        color: '#8ecae6',
        icon: `url("/icons/snowflake.svg")`,
    },
} as const;

export function getSeasonEventsBetween(
    tsA: number,
    tsB: number,
    hemisphere: Hemisphere = 'north',
): SeasonEvent[] {
    if (!Number.isFinite(tsA) || !Number.isFinite(tsB)) {
        throw new TypeError('Timestamps must be finite numbers (Unix ms).');
    }

    if (hemisphere !== 'north' && hemisphere !== 'south') {
        throw new RangeError(`Hemisphere must be "north" or "south".`);
    }

    const start = Math.min(tsA, tsB);
    const end = Math.max(tsA, tsB);

    const startYear = new Date(start).getUTCFullYear() - 1;
    const endYear = new Date(end).getUTCFullYear() + 1;

    const results: SeasonEvent[] = [];

    for (let year = startYear; year <= endYear; year++) {
        const candidates = getSeasonBoundariesForYear(year, hemisphere);

        for (const event of candidates) {
            if (event.timestamp >= start && event.timestamp <= end) {
                results.push(event);
            }
        }
    }

    results.sort((a, b) => a.timestamp - b.timestamp);
    return results;
}

function getSeasonBoundariesForYear(year: number, hemisphere: Hemisphere): SeasonEvent[] {
    if (hemisphere === 'north') {
        return [
            {
                timestamp: Date.UTC(year, 2, 1, 0, 0, 0, 0),
                type: 'spring',
            },
            {
                timestamp: Date.UTC(year, 5, 1, 0, 0, 0, 0),
                type: 'summer',
            },
            {
                timestamp: Date.UTC(year, 8, 1, 0, 0, 0, 0),
                type: 'autumn',
            },
            {
                timestamp: Date.UTC(year, 11, 1, 0, 0, 0, 0),
                type: 'winter',
            },
        ];
    }

    return [
        {
            timestamp: Date.UTC(year, 2, 1, 0, 0, 0, 0),
            type: 'autumn',
        },
        {
            timestamp: Date.UTC(year, 5, 1, 0, 0, 0, 0),
            type: 'winter',
        },
        {
            timestamp: Date.UTC(year, 8, 1, 0, 0, 0, 0),
            type: 'spring',
        },
        {
            timestamp: Date.UTC(year, 11, 1, 0, 0, 0, 0),
            type: 'summer',
        },
    ];
}

export function makeSeasonEventsLinearGradient(
    start: number,
    end: number,
    events: SeasonEvent[],
    direction = 'to right',
): string {
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
        throw new TypeError('Start and end must be finite numbers (Unix ms).');
    }

    if (start === end) {
        const fallbackColor =
            events.length > 0 ? displayPropertyBySeason[events[0]!.type].color : '#cfe8ff';

        return `linear-gradient(${direction}, ${fallbackColor} 0%, ${fallbackColor} 100%)`;
    }

    if (events.length === 0) {
        return `linear-gradient(${direction}, #cfe8ff 0%, #cfe8ff 100%)`;
    }

    const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);

    const stops: string[] = [];

    const startColor = edgeColorBefore(sorted[0]!.type);
    stops.push(`${startColor} 0%`);

    for (const [index, event] of sorted.entries()) {
        const midpoint = getEventMidpointTimestamp(sorted, index, end);
        const pct = ((midpoint - start) / (end - start)) * 100;
        const clampedPct = Math.max(0, Math.min(100, pct));

        stops.push(`${displayPropertyBySeason[event.type].color} ${clampedPct.toFixed(3)}%`);
    }

    const endColor = edgeColorAfter(sorted[sorted.length - 1]!.type);
    stops.push(`${endColor} 100%`);

    return `linear-gradient(${direction}, ${stops.join(', ')})`;
}

export function makeSeasonEventsBackground(
    start: number,
    end: number,
    events: SeasonEvent[],
    direction = 'to right',
    iconSize = 32,
): BackgroundStyle {
    if (events.length === 0) {
        return {
            backgroundImage: `linear-gradient(${direction}, #cfe8ff 0%, #cfe8ff 100%)`,
            backgroundPosition: '0 0',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
        };
    }

    const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
    const gradient = makeSeasonEventsLinearGradient(start, end, sorted, direction);

    const iconLayers: string[] = [];
    const positions: string[] = [];
    const repeats: string[] = [];
    const sizes: string[] = [];

    for (const [index, event] of sorted.entries()) {
        const midpoint = getEventMidpointTimestamp(sorted, index, end);
        const pct = end === start ? 50 : ((midpoint - start) / (end - start)) * 100;
        const clampedPct = Math.max(0, Math.min(100, pct));

        iconLayers.push(displayPropertyBySeason[event.type].icon);
        positions.push(`${clampedPct.toFixed(3)}% 50%`);
        repeats.push('no-repeat');
        sizes.push(`${iconSize}px ${iconSize}px`);
    }

    return {
        backgroundImage: [...iconLayers, gradient].join(', '),
        backgroundPosition: [...positions, '0 0'].join(', '),
        backgroundRepeat: [...repeats, 'no-repeat'].join(', '),
        backgroundSize: [...sizes, '100% 100%'].join(', '),
    };
}

function getEventMidpointTimestamp(events: SeasonEvent[], index: number, rangeEnd: number): number {
    const eventStart = events[index]!.timestamp;
    const eventEnd = events[index + 1]?.timestamp ?? rangeEnd;

    return eventStart + (eventEnd - eventStart) / 2;
}

function edgeColorBefore(type: SeasonEvent['type']): string {
    switch (type) {
        case 'spring':
            return '#dff3d8';
        case 'summer':
            return '#fff4b3';
        case 'autumn':
            return '#f2d1a0';
        case 'winter':
            return '#dceef8';
    }
}

function edgeColorAfter(type: SeasonEvent['type']): string {
    switch (type) {
        case 'spring':
            return '#fff4b3';
        case 'summer':
            return '#f2d1a0';
        case 'autumn':
            return '#dceef8';
        case 'winter':
            return '#dff3d8';
    }
}
