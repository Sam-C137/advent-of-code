import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();

    const pair = text.split(/\s/).filter(Boolean);

    let num_matches = 0;

    pair.forEach((p) => {
        const [first, second] = p.split(",");

        const f_range = new Set(
            range(...(first.split("-").map(Number) as [number, number])),
        );

        const s_range = new Set(
            range(...(second.split("-").map(Number) as [number, number])),
        );

        if (s_range.intersection(f_range).size > 0) num_matches++;
    });

    return num_matches;
}

function range(start: number, end: number) {
    return new Array(end - start + 1).fill(null).map((_, i) => i + start);
}

describe("camp cleanup: part 2", () => {
    test("The total assignments with intersecting ranges to be 861", async () => {
        const result = await main();
        expect(result).toEqual(861);
    });
});
