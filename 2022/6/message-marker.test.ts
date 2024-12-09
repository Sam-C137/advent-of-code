import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const sequence = await file.text();

    let l = 0;
    let seen = new Map<string, number>();

    for (let r = 0; r < sequence.length; r++) {
        if (seen.has(sequence[r])) {
            l = Math.max(l, (seen.get(sequence[r]) || 0) + 1);
        }

        seen.set(sequence[r], r);

        if (r - l + 1 === 14) return r + 1;
    }
}

describe("message marker", () => {
    test("The first marker occurs after 3037 characters", async () => {
        const result = await main();
        expect(result).toEqual(3037);
    });
});
