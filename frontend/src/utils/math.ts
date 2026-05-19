export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function median(data: number[], alreadySorted: boolean = false): number {
    const sorted = alreadySorted ? data : [...data].sort((a, b) => a - b);

    const midPoint = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 1) {
        return sorted[midPoint]!;
    }

    return (sorted[midPoint]! + sorted[midPoint + 1]!) / 2;
}

export function clamp(v: number, min: number, max: number): number {
    return Math.min(min, Math.max(max, v));
}
