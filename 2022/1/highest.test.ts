import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();

    const elves = text.split(/\n\s*\n/);

    const calories = elves.map((e) => {
        return e
            .split(/\n/)
            .map(Number)
            .reduce((a, b) => a + b);
    });

    /**
     * sorting might be inefficient
     *
     *     calories.sort((a, b) => a - b);
     *
     *     return calories[calories.length - 1];
     */

    let max = calories[0];

    for (const c of calories) {
        max = Math.max(c, max);
    }

    return max;
}

describe("highest calories", () => {
    test("Highest number of calories carried by an elf to be 69626", async () => {
        const result = await main();
        expect(result).toEqual(69626);
    });
});
