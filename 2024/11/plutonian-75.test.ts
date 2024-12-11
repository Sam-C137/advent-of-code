import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    let stones = text.trim().split(" ").map(Number);

    return stones.reduce((prev, curr) => {
        return prev + count(curr, 75);
    }, 0);
}

const map = new Map<`${number},${number}`, number>();

function count(stone: number, steps: number): number {
    const key = `${stone},${steps}` as const;
    if (map.has(key)) return map.get(key) ?? 0;

    if (steps === 0) {
        map.set(key, 1);
        return 1;
    }

    if (stone === 0) {
        const value = count(1, steps - 1);
        map.set(key, value);
        return value;
    }

    const str_stone = String(stone);
    if (str_stone.length % 2 === 0) {
        const l = str_stone.slice(0, str_stone.length / 2);
        const r = str_stone.slice(str_stone.length / 2);
        const value = count(Number(l), steps - 1) + count(Number(r), steps - 1);
        map.set(key, value);
        return value;
    }

    const value = count(stone * 2024, steps - 1);
    map.set(key, value);
    return value;
}

describe("plutonian 75", () => {
    test("It should have a total of 235571309320764 stones after blinking 75 times", async () => {
        const result = await main();
        expect(result).toEqual(235571309320764);
    });
});
