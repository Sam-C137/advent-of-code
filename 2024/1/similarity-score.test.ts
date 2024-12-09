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

    const out: number[] = [];

    for (const item of list1) {
        out.push(similarity(item, list2));
    }

    return out.reduce((a, b) => a + b);
}

function parse(text: string): [number, number] {
    const split = text.split("   ");
    return [Number(split[0].trim()), Number(split[1].trim())];
}

function similarity(target: number, arr: number[]): number {
    let count = 0;
    for (const number of arr) {
        if (number === target) count++;
    }
    return target * count;
}

describe("similarity score", () => {
    test("Total similarity score to be 23741109", async () => {
        const result = await main();
        expect(result).toEqual(23741109);
    });
});
