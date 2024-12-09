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

    calories.sort((a, b) => a - b);

    return calories.slice(-3).reduce((a, b) => a + b);
}

describe("top 3 calories", () => {
    test("Total calories carried by the top 3 elves to be 206780", async () => {
        const result = await main();
        expect(result).toEqual(206780);
    });
});
