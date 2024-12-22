Object.defineProperty(String.prototype, "fromTuple", {
    value: function (): [...[number]] {
        return this.split(",").map(Number);
    },
});

Object.defineProperty(Array.prototype, "toTuple", {
    value: function (): string {
        return this.join(",");
    },
});

export const sum_callback = (a: number, b: number) => a + b;

interface NonEmptyArray<T> extends Array<T> {
    shift(): T;
    pop(): T;
}

export const is_not_empty = <T>(arr: T[]): arr is NonEmptyArray<T> =>
    arr.length > 0;

export const is_out_of_bounds = <T>(r: number, c: number, grid: T[][]) =>
    r < 0 || r >= grid.length || c < 0 || c >= grid[0].length;

Array.prototype.serialize = function () {
    return JSON.stringify(this);
};

String.prototype.deserialize = function <T>() {
    return JSON.parse(this as string) as T;
};

export const cartesian_product = (...args: Array<any>[]) =>
    args.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

cartesian_product.lazy = function* (...args: Array<any>[]): Generator<any[]> {
    if (args.length === 0) {
        yield [];
        return;
    }
    const [first, ...rest] = args;
    for (const item of first) {
        for (const prod of cartesian_product.lazy(...rest)) {
            yield [item, ...prod];
        }
    }
};

export const zip = (...args: (Array<any> | string)[]) => {
    const min = Math.min(...args.map((arr) => arr.length));
    return new Array(min).fill(null).map((_, i) => args.map((arr) => arr[i]));
};

zip.lazy = function* (...args: (Array<any> | string)[]): Generator<any[]> {
    const min = Math.min(...args.map((arr) => arr.length));
    for (let i = 0; i < min; i++) {
        yield args.map((arr) => arr[i]);
    }
};

export * from "./ds.ts";
