import { clamp, median } from './math';

interface ValueWithIndex {
    value: number;
    xIndex: number;
    yIndex: number;
}

interface Slice2D {
    slice: Array2D;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export class Array2D {
    private data: number[][];

    constructor(data: number[][]) {
        this.data = data;
    }

    get width(): number {
        return this.data.length;
    }

    get height(): number {
        return this.data.length > 0 ? this.data[0]!.length : 0;
    }

    public getData(): number[][] {
        return this.data;
    }

    at(x: number, y: number): number | undefined {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return undefined;
        }

        return this.data[x]?.[y];
    }

    public max(): ValueWithIndex {
        let max: ValueWithIndex = {
            value: -Infinity,
            xIndex: -1,
            yIndex: -1,
        };

        for (let x = 0; x < this.width; x += 1) {
            for (let y = 0; y < this.height; y += 1) {
                const value = this.at(x, y)!;

                if (value > max.value) {
                    max = { value, xIndex: x, yIndex: y };
                }
            }
        }

        return max;
    }

    public mean(): number {
        const n = this.width * this.height;

        if (n === 0) {
            throw new Error('Cannot compute mean of an empty Array2D.');
        }

        let sum = 0;

        for (let x = 0; x < this.width; x += 1) {
            for (let y = 0; y < this.height; y += 1) {
                sum += this.at(x, y)!;
            }
        }

        return sum / n;
    }

    public standardDeviation(sample = false): number {
        const n = this.width * this.height;

        if (n === 0) {
            throw new Error('Cannot compute standard deviation of an empty Array2D.');
        }

        if (sample && n < 2) {
            throw new Error('Cannot compute sample standard deviation with fewer than 2 values.');
        }

        const mean = this.mean();
        let varianceSum = 0;

        for (let x = 0; x < this.width; x += 1) {
            for (let y = 0; y < this.height; y += 1) {
                const diff = this.at(x, y)! - mean;
                varianceSum += diff * diff;
            }
        }

        const divisor = sample ? n - 1 : n;
        return Math.sqrt(varianceSum / divisor);
    }

    public zScore(sample = false): Array2D {
        const mean = this.mean();
        const std = this.standardDeviation(sample);

        if (std === 0) {
            return this.map(() => 0);
        }

        return this.map((value) => (value - mean) / std);
    }

    public map(func: (value: number, x: number, y: number) => number): Array2D {
        const newData = this.data.map((row, x) => row.map((value, y) => func(value, x, y)));

        return new Array2D(newData);
    }

    /**
     * Applies a 2D moving average filter to the data.
     */
    public smoothMovingAverage(windowSizeX: number, windowSizeY: number): Array2D {
        const radiusX = Math.floor(windowSizeX / 2);
        const radiusY = Math.floor(windowSizeY / 2);

        const newData = this.data.map((row, i) => {
            const startX = Math.max(0, i - radiusX);
            const endX = Math.min(this.width - 1, i + radiusX);
            const w = endX - startX + 1;

            return row.map((_, j) => {
                const startY = Math.max(0, j - radiusY);
                const endY = Math.min(this.height - 1, j + radiusY);
                const h = endY - startY + 1;

                let sum = 0;

                for (let xi = startX; xi <= endX; xi += 1) {
                    for (let yj = startY; yj <= endY; yj += 1) {
                        sum += this.at(xi, yj)!;
                    }
                }

                return sum / (w * h);
            });
        });

        return new Array2D(newData);
    }

    public slice2D(startX: number, endX: number, startY: number, endY: number): Slice2D {
        const minX = clamp(Math.min(startX, endX), 0, this.width - 1);
        const maxX = clamp(Math.max(startX, endX), 0, this.width - 1);
        const minY = clamp(Math.min(startY, endY), 0, this.height - 1);
        const maxY = clamp(Math.max(startY, endY), 0, this.height - 1);

        const newData = this.data.slice(minX, maxX + 1).map((row) => row.slice(minY, maxY + 1));

        return { slice: new Array2D(newData), minX, minY, maxX, maxY };
    }

    public peakInRange(
        startX: number,
        endX: number,
        startY: number,
        endY: number,
        topPercent?: number,
    ): ValueWithIndex | null {
        if (this.width === 0 || this.height === 0) {
            return null;
        }

        const { slice, minX, minY } = this.slice2D(startX, endX, startY, endY);
        const max = slice.max();

        if (topPercent === undefined || topPercent === 100) {
            return {
                value: max.value,
                xIndex: max.xIndex + minX,
                yIndex: max.yIndex + minY,
            };
        }

        const factor = clamp(topPercent, 0, 100) / 100;
        const threshold = max.value * factor;

        const topValues: number[] = [];
        let weightedX = 0;
        let weightedY = 0;
        let totalWeight = 0;

        for (let x = 0; x < slice.width; x += 1) {
            for (let y = 0; y < slice.height; y += 1) {
                const value = slice.at(x, y);

                if (value === undefined || value < threshold) {
                    continue;
                }

                topValues.push(value);

                const weight = value - threshold;

                if (weight > 0) {
                    weightedX += x * weight;
                    weightedY += y * weight;
                    totalWeight += weight;
                }
            }
        }

        if (topValues.length === 0) {
            return null;
        }

        if (totalWeight === 0) {
            return {
                value: median(topValues),
                xIndex: max.xIndex + minX,
                yIndex: max.yIndex + minY,
            };
        }

        return {
            value: median(topValues),
            xIndex: weightedX / totalWeight + minX,
            yIndex: weightedY / totalWeight + minY,
        };
    }

    public peakValueInRange(
        startX: number,
        endX: number,
        startY: number,
        endY: number,
        topPercent?: number,
    ): number | null {
        return this.peakInRange(startX, endX, startY, endY, topPercent)?.value ?? null;
    }
}
