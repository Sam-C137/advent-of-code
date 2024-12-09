import { describe, expect, test } from "bun:test";
import * as path from "node:path";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const lines = text.split(/\n/);
    const list1: number[] = [];
    const list2: number[] = [];

    for (const line of lines) {
        const [l1, l2] = parse(line);
        list1.push(l1);
        list2.push(l2);
    }

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    return list1.reduce((acc, curr, idx) => {
        const diff = Math.abs(curr - list2[idx]);
        return acc + diff;
    }, 0);
}

function parse(text: string): [number, number] {
    const split = text.split("   ");
    return [Number(split[0].trim()), Number(split[1].trim())];
}

describe("historian hysteria", () => {
    test("Total distance between the left list and right list to be 2166959", async () => {
        const result = await main();
        expect(result).toEqual(2166959);
    });
});
