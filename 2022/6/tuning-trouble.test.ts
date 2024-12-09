import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const sequence = await file.text();

    let left = 0;
    const seen = new Set(sequence[left]);

    for (let right = 1; right < sequence.length; right++) {
        if (seen.has(sequence[right])) {
            left = right;
            seen.clear();
        } else {
            seen.add(sequence[right]);
        }

        if (seen.size === 4) {
            return right;
        }
    }
}

describe("tuning trouble", () => {
    test("The first marker occurs after 1238 characters", async () => {
        const result = await main();
        expect(result).toEqual(1238);
    });
});
