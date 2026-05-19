export function uniqueSorted(values: number[]): number[] {
    return [...new Set(values)].sort((a, b) => a - b);
}

export function arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

export function sortedArrayRange(
    array: number[],
    startValue: number,
    endValue: number,
): [number, number] {
    const startIndex = array.findIndex((value) => value >= startValue);
    const endIndex = array.findIndex((value) => value > endValue);
    return [startIndex, endIndex];
}
