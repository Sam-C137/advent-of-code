import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();

    const sacks = text.split(/\n/).filter(Boolean);

    const groups: string[][] = [];

    for (let i = 0; i < sacks.length; i += 3) {
        groups.push(sacks.slice(i, i + 3));
    }

    let total_priority = 0;

    groups.forEach((g) => {
        const badge = similarity(g[0], g[1], g[2]);
        total_priority += priority(Array.from(badge)[0]);
    });

    return total_priority;
}

function priority(char: string) {
    if (char.charCodeAt(0) > 96) {
        return char.charCodeAt(0) - 96;
    }

    return char.charCodeAt(0) - 38;
}

function similarity(str1: string, str2: string, str3: string) {
    const set1 = new Set(str1);
    const set2 = new Set(str2);
    const set3 = new Set(str3);

    return set1.intersection(set2).intersection(set3);
}

describe("group badges", () => {
    test("The total priority to be 2864", async () => {
        const result = await main();
        expect(result).toEqual(2864);
    });
});
