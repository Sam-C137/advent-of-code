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
    const out: [number, number][] = [];
    let should_do: boolean = true;

    input.match(/mul\(\d+,\d+\)|do\(\)|don't\(\)/g)?.forEach((inst) => {
        if (/mul\(\d+,\d+\)/.test(inst)) {
            if (should_do) {
                out.push(inst.match(/\d+/g)?.map(Number) as [number, number]);
            }
        } else {
            should_do = inst === "do()";
        }
    });

    return out;
}

describe("do don't", () => {
    test("Total results of all multiplications to be 95411583", async () => {
        const result = await main();
        expect(result).toEqual(95411583);
    });
});
