import { describe, expect, test } from "bun:test";
import * as path from "node:path";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const lines = text.split(/\n/);
    let safe_count = 0;

    for (const line of lines) {
        const rpt = line.split(" ").map(Number);
        if (is_safe(rpt)) safe_count++;
    }

    return safe_count;
}

function is_safe(rpt: number[]): boolean {
    if (!is_sorted(rpt)) return false;

    for (let i = 1; i < rpt.length; i++) {
        if (rpt[i] === rpt[i - 1]) return false;
        if (Math.abs(rpt[i] - rpt[i - 1]) > 3) return false;
    }

    return true;
}

function is_sorted(arr: number[]): boolean {
    if (!arr.length) return false;
    if (arr.length < 3) return true;

    if (arr[1] > arr[0]) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
    } else {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > arr[i - 1]) return false;
        }
    }

    return true;
}

describe("red nosed reports", () => {
    test("Total number of safe reports to be 299", async () => {
        const result = await main();
        expect(result).toEqual(299);
    });
});
