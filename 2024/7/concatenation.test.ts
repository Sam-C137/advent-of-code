import { describe, expect, test } from "bun:test";
import * as path from "node:path";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const lines = text.split(/\n/);
    let sum = 0;

    lines.forEach((l) => {
        const [target, nums] = get_values(l);
        if (operate(nums, target)) sum += target;
    });

    return sum;
}

function get_values(input: string): [number, number[]] {
    const split = input.split(":");

    return [
        Number(split[0].trim()),
        split[1]
            .split(" ")
            .map((str) => str.trim())
            .map(Number),
    ];
}

function operate(
    nums: number[],
    target: number,
    idx = 0,
    curr = 0,
    map?: Map<string, boolean>,
): boolean {
    if (!map) {
        map = new Map();
    }

    if (map.has(`${idx},${curr}`)) {
        return map.get(`${idx},${curr}`) ?? false;
    }

    if (idx === nums.length) {
        return curr === target;
    }

    if (operate(nums, target, idx + 1, curr + nums[idx], map)) {
        map.set(`${idx},${curr}`, true);
        return true;
    }

    if (operate(nums, target, idx + 1, curr * nums[idx], map)) {
        map.set(`${idx},${curr}`, true);
        return true;
    }

    if (operate(nums, target, idx + 1, Number(`${curr}${nums[idx]}`), map)) {
        map.set(`${idx},${curr}`, true);
        return true;
    }

    map.set(`${idx},${curr}`, false);
    return false;
}

describe("concatenation", () => {
    test("Total sum of test values from operations that could be true to be 189207836795655", async () => {
        const result = await main();
        expect(result).toEqual(189207836795655);
    });
});
