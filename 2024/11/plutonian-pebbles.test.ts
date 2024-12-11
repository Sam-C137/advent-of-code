import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    let stones = text.trim().split(" ").map(Number);

    for (let i = 0; i < 25; i++) {
        let out: number[] = [];
        for (const stone of stones) {
            if (stone === 0) {
                out.push(1);
                continue;
            }
            const str_stone = String(stone);
            if (str_stone.length % 2 === 0) {
                const l = str_stone.slice(0, str_stone.length / 2);
                const r = str_stone.slice(str_stone.length / 2);
                out.push(Number(l), Number(r));
            } else {
                out.push(stone * 2024);
            }
        }
        stones = out;
    }

    return stones.length;
}

describe("plutonian pebbles", () => {
    test("It should have a total of 198075 stones after blinking 25 times", async () => {
        const result = await main();
        expect(result).toEqual(198075);
    });
});
