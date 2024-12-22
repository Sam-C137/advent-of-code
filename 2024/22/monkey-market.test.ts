import path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const nums = text.split(/\n/);

    let total = 0n;

    for (const num of nums) {
        let _num = BigInt(num.trim());
        for (let i = 0; i < 2000; i++) {
            _num = step(_num);
        }
        total += _num;
    }

    return Number(total);
}

function step(num: bigint): bigint {
    num = (num ^ (num * 64n)) % 16777216n;
    num = (num ^ (num / 32n)) % 16777216n;
    num = (num ^ (num * 2048n)) % 16777216n;
    return num;
}

describe("monkey market", () => {
    test("It should have a total market price of 19822877190", async () => {
        const result = await main();
        expect(result).toEqual(19822877190);
    });
});
