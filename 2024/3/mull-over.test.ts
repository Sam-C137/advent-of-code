import { describe, expect, test } from "bun:test";
import * as path from "node:path";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const sum: number[] = [];

    get_instruction(text)?.forEach(([a, b]) => {
        sum.push(a * b);
    });

    return sum.reduce((a, b) => a + b);
}

function get_instruction(input: string) {
    return input
        .match(/mul\(\d+,\d+\)/g)
        ?.map((inst) => inst.match(/\d+/g)?.map(Number) as [number, number]);
}

describe("mull over", () => {
    test("Total results of all multiplications to be 180233229", async () => {
        const result = await main();
        expect(result).toEqual(180233229);
    });
});
