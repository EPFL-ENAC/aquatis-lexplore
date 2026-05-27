export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;

export interface TrackPoint {
    timestamp: number;
    value: number;
}

export interface TimelineDomain {
    start: number;
    end: number;
}

export interface TimelineTick {
    timestamp: number;
    label: string;
    secondaryLabel?: string | undefined;
    isDayStart: boolean;
}

export type TrackType = 'bar' | 'line';

export interface TrackProperties {
    title: string;
    type: TrackType;
    data: TrackPoint[];
    color?: string;
    stepMs?: number;
}

export class Track {
    private _title: string;
    private _type: TrackType;
    private _data: TrackPoint[];
    private _color: string;

    private _min: number = 0;
    private _max: number = 1;
    private _stepMs: number = HOUR_MS;

    constructor(props: TrackProperties) {
        this._title = props.title;
        this._type = props.type;
        this._color = props.color ?? 'cyan';
        this._data = [...props.data].sort((a, b) => a.timestamp - b.timestamp);
        this._stepMs = props.stepMs ?? HOUR_MS;

        this.computeRange();
    }

    get title(): string {
        return this._title;
    }

    get type(): TrackType {
        return this._type;
    }

    get data(): TrackPoint[] {
        return this._data;
    }

    private computeRange() {
        if (this._data.length === 0) {
            return;
        }

        const values = this._data.map((point) => point.value);

        this._min = Math.min(...values);
        this._max = Math.max(...values);

        if (this._type === 'bar' && this._min > 0) {
            this._min = 0;
        }

        if (this._max === this._min) {
            this._max = this._min + 1;
        }

        if (this._type === 'line') {
            const pad = Math.max((this._max - this._min) * 0.08, 1);

            this._min -= pad;
            this._max += pad;
        }
    }

    get min(): number {
        return this._min;
    }

    get max(): number {
        return this._max;
    }

    get stepMs(): number {
        return this._stepMs;
    }

    get color(): string {
        return this._color;
    }

    getTimeRange(): { min: number; max: number } {
        if (this._data.length === 0) {
            return { min: 0, max: 0 };
        }

        const min = this._data[0]!.timestamp;
        let max = this._data[this._data.length - 1]!.timestamp;

        if (this._type === 'bar') {
            max += this._stepMs;
        }

        return { min, max };
    }
}

export class Timeline {
    private _tracks: Track[];

    constructor(tracks: TrackProperties[]) {
        this._tracks = tracks.map((props) => new Track(props));
    }

    get tracks(): Track[] {
        return this._tracks;
    }

    getTimeRange(): { min: number; max: number } {
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;

        for (const track of this._tracks) {
            const { min: trackMin, max: trackMax } = track.getTimeRange();

            min = Math.min(min, trackMin);
            max = Math.max(max, trackMax);
        }

        if (!Number.isFinite(min) || !Number.isFinite(max)) {
            return { min: 0, max: 0 };
        }

        return { min, max };
    }

    getDomain(): TimelineDomain {
        const { min, max } = this.getTimeRange();
        return { start: min, end: max };
    }

    getTicks(tickEveryMinutes = 4 * 60, locale?: string): TimelineTick[] {
        const domain = this.getDomain();

        const stepMinutes = Math.max(1, tickEveryMinutes);

        const timeFormatter = new Intl.DateTimeFormat(locale, {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        });
        const dateFormatter = new Intl.DateTimeFormat(locale, {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
        });

        const ticks: TimelineTick[] = [];

        const start = new Date(domain.start);

        const midnight = new Date(start);
        midnight.setHours(0, 0, 0, 0);

        const minutesSinceMidnight =
            start.getHours() * 60 +
            start.getMinutes() +
            start.getSeconds() / 60 +
            start.getMilliseconds() / 60000;

        const firstTickMinutes = Math.ceil(minutesSinceMidnight / stepMinutes) * stepMinutes;

        const tick = new Date(midnight);
        tick.setMinutes(firstTickMinutes, 0, 0);

        for (; tick.getTime() <= domain.end; tick.setMinutes(tick.getMinutes() + stepMinutes)) {
            const isDayStart = tick.getHours() === 0 && tick.getMinutes() === 0;

            ticks.push({
                timestamp: tick.getTime(),
                label: timeFormatter.format(tick),
                secondaryLabel: isDayStart ? dateFormatter.format(tick) : undefined,
                isDayStart,
            });
        }

        return ticks;
    }
}
