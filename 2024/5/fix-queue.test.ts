import { describe, expect, test } from "bun:test";
import * as path from "node:path";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const [ordering, updates] = text.split(/\n\s+/);
    const dict = parse_ordering(ordering);
    const invalid_updates: number[][] = [];

    updates.split(/\n/).forEach((u) => {
        const update = u.split(",").map(Number);
        const is_valid = update.every((u, idx) => {
            const lookup = dict.get(u);
            return update
                .slice(idx + 1)
                .every((item) => lookup?.includes(item));
        });
        if (!is_valid) invalid_updates.push(update);
    });

    invalid_updates.forEach((update) => {
        update.sort((a, b) => {
            const a_lookup = dict.get(a);
            const b_lookup = dict.get(b);

            if (a_lookup?.includes(b)) return -1;

            if (b_lookup?.includes(a)) return 1;

            return 0;
        });
    });

    return invalid_updates.reduce((prev, curr) => {
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

describe("fix queue", () => {
    test("Total sum of middle numbers of invalid updates to be 5180", async () => {
        const result = await main();
        expect(result).toEqual(5180);
    });
});
