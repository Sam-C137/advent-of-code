import { describe, expect, test } from "bun:test";
import * as path from "node:path";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const [ordering, updates] = text.split(/\n\s+/);
    const dict = parse_ordering(ordering);
    const valid_updates: number[][] = [];

    updates.split(/\n/).forEach((u) => {
        const update = u.split(",").map(Number);
        const is_valid = update.every((u, idx) => {
            const lookup = dict.get(u);
            return update
                .slice(idx + 1)
                .every((item) => lookup?.includes(item));
        });
        if (is_valid) valid_updates.push(update);
    });

    return valid_updates.reduce((prev, curr) => {
        return prev + curr[Math.floor(curr.length / 2)];
    }, 0);
}

function parse_ordering(o: string): Map<number, number[]> {
    const ordering = o
        .split(/\n/)
        .map((o) => o.trim())
        .map((o) => o.split("|"))
        .map((o) => o.map(Number)) as [number, number][];

    const dict = new Map<number, number[]>();
    for (const [x, y] of ordering) {
        dict.set(x, dict.has(x) ? [...(dict.get(x) ?? []), y] : [y]);
    }
    return dict;
}

describe("print queue", () => {
    test("Total sum of middle numbers of valid updates to be 5713", async () => {
        const result = await main();
        expect(result).toEqual(5713);
    });
});
