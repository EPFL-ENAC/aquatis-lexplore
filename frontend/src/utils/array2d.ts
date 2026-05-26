import { arrayClamp, clamp, lerp, median } from './math';

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

    static zeros(width: number, height: number): Array2D {
        const data = Array.from({ length: width }, () => Array.from({ length: height }, () => 0));
        return new Array2D(data);
    }

    public getData(): number[][] {
        return this.data;
    }

    public copy(): Array2D {
        const newData = this.data.map((row) => [...row]);
        return new Array2D(newData);
    }

    setColumn(x: number, columnData: number[]): void {
        if (x < 0 || x >= this.width) {
            throw new Error(`x index ${x} is out of bounds.`);
        }
        if (columnData.length !== this.height) {
            throw new Error(
                `Column data length ${columnData.length} does not match Array2D height ${this.height}.`,
            );
        }

        this.data[x] = [...columnData];
    }

    at(x: number, y: number): number | undefined {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return undefined;
        }

        return this.data[x]?.[y];
    }

    static fromTransposed(data: number[][], flipY: boolean = false): Array2D {
        const transposedData =
            data[0]?.map((_, i) => {
                const row = data.map((row) => row[i]!);
                return flipY ? row.reverse() : row;
            }) ?? [];
        if (!transposedData) return new Array2D([]);

        return new Array2D(transposedData);
    }

    public transpose(): Array2D {
        if (this.width === 0 || this.height === 0) {
            return new Array2D([]);
        }

        const newData = Array.from({ length: this.height }, (_, x) =>
            Array.from({ length: this.width }, (_, y) => this.at(y, x)!),
        );

        return new Array2D(newData);
    }

    public min(): ValueWithIndex {
        let min: ValueWithIndex = {
            value: Infinity,
            xIndex: -1,
            yIndex: -1,
        };

        for (let x = 0; x < this.width; x += 1) {
            for (let y = 0; y < this.height; y += 1) {
                const value = this.at(x, y)!;

                if (Number.isFinite(value) && value < min.value) {
                    min = { value, xIndex: x, yIndex: y };
                }
            }
        }

        return min;
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

                if (Number.isFinite(value) && value > max.value) {
                    max = { value, xIndex: x, yIndex: y };
                }
            }
        }

        return max;
    }

    public minMax(): { min: ValueWithIndex; max: ValueWithIndex } {
        let min: ValueWithIndex = {
            value: Infinity,
            xIndex: -1,
            yIndex: -1,
        };

        let max: ValueWithIndex = {
            value: -Infinity,
            xIndex: -1,
            yIndex: -1,
        };

        for (let x = 0; x < this.width; x += 1) {
            for (let y = 0; y < this.height; y += 1) {
                const value = this.at(x, y)!;

                if (!Number.isFinite(value)) {
                    continue;
                }

                if (value < min.value) {
                    min = { value, xIndex: x, yIndex: y };
                }

                if (value > max.value) {
                    max = { value, xIndex: x, yIndex: y };
                }
            }
        }

        return { min, max };
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

    public maxAtX(x: number): { yIndex: number; value: number } {
        if (x < 0 || x >= this.width) {
            throw new Error(`x index ${x} is out of bounds.`);
        }

        let max = {
            value: -Infinity,
            yIndex: -1,
        };

        for (let y = 0; y < this.height; y += 1) {
            const value = this.at(x, y)!;

            if (Number.isFinite(value) && value > max.value) {
                max = { value, yIndex: y };
            }
        }

        return max;
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
        const clampedStartX = arrayClamp(startX, this.width);
        const clampedEndX = arrayClamp(endX, this.width);
        const clampedStartY = arrayClamp(startY, this.height);
        const clampedEndY = arrayClamp(endY, this.height);

        const minX = Math.min(clampedStartX, clampedEndX);
        const maxX = Math.max(clampedStartX, clampedEndX);
        const minY = Math.min(clampedStartY, clampedEndY);
        const maxY = Math.max(clampedStartY, clampedEndY);

        const newData = this.data.slice(minX, maxX).map((row) => row.slice(minY, maxY));

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

    public replaceYRangeByLerp(startY: number, endY: number): Array2D {
        const copy = this.copy();

        for (let x = 0; x < this.width; x += 1) {
            const startValue = copy.at(x, startY)!;
            const endValue = copy.at(x, endY)!;

            for (let y = startY; y <= endY; y += 1) {
                const t = (y - startY) / (endY - startY);
                const newValue = lerp(startValue, endValue, t);
                copy.data[x]![y] = newValue;
            }
        }

        return copy;
    }

    public getInterpolatedColumn(
        xInterpolationA: number,
        xInterpolationB: number,
        t: number,
        interpolationFunction: (min: number, max: number, t: number) => number = lerp,
    ): number[] {
        const interpolatedColumn: number[] = [];
        for (let y = 0; y < this.height; y++) {
            const valueA = this.at(xInterpolationA, y)!;
            const valueB = this.at(xInterpolationB, y)!;
            const newValue = interpolationFunction(valueA, valueB, t);
            interpolatedColumn.push(newValue);
        }

        return interpolatedColumn;
    }
}
