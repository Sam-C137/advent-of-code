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

export * from "./ds.ts";
