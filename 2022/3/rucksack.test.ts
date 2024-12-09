import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();

    const sacks = text.split(/\n/).filter(Boolean);

    let total_priority = 0;

    sacks.forEach((s) => {
        const left = s.slice(0, Math.floor(s.length / 2));
        const right = s.slice(Math.floor(s.length / 2));

        const similar = similarity(left, right);

        if (similar) {
            total_priority += priority(similar);
        }
    });

    return total_priority;
}

function priority(char: string) {
    if (char.charCodeAt(0) > 96) {
        return char.charCodeAt(0) - 96;
    }

    return char.charCodeAt(0) - 38;
}

function similarity(str1: string, str2: string) {
    for (const s of str1) {
        if (str2.includes(s)) {
            return s;
        }
    }
}

describe("rucksack", () => {
    test("The total priority to be 8202", async () => {
        const result = await main();
        expect(result).toEqual(8202);
    });
});
