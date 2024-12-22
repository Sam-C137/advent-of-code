import path from "node:path";
import "utils";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const nums = text.split(/\n/);

    let total = 0n;
    const seq_to_total = new Map<string, bigint>();

    for (const num of nums) {
        let _num = BigInt(num.trim());
        const buyer = [_num % 10n];
        for (let i = 0; i < 2000; i++) {
            _num = step(_num);
            buyer.push(_num % 10n);
        }

        const seen = new Set<string>();
        for (let i = 0; i < buyer.length - 4; i++) {
            const [a, b, c, d, e] = buyer.slice(i, i + 5);
            const seq = [b - a, c - b, d - c, e - d];
            const key = seq.toTuple();
            if (seen.has(key)) continue;
            seen.add(key);
            seq_to_total.set(key, (seq_to_total.get(key) ?? 0n) + e);
        }
        total += _num;
    }

    let max = 0n;
    for (const value of seq_to_total.values()) {
        max = value > max ? value : max;
    }

    return Number(max);
}

function step(num: bigint): bigint {
    num = (num ^ (num * 64n)) % 16777216n;
    num = (num ^ (num / 32n)) % 16777216n;
    num = (num ^ (num * 2048n)) % 16777216n;
    return num;
}

describe("buyers price", () => {
    test("It should have a best market price of 2277", async () => {
        const result = await main();
        expect(result).toEqual(2277);
    });
});
