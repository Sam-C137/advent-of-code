import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    let disk: (number | string)[] = text.trim().split("").map(Number);
    disk = generate_blocks(disk);
    swap(disk);
    return disk.reduce((prev, curr, idx) => {
        return isInt(prev) && isInt(curr) ? prev + curr * idx : prev;
    }, 0);
}

function generate_blocks(disk: (number | string)[]): (number | string)[] {
    let out: (number | string)[] = [];

    for (let i = 0, file_idx = 0; i < disk.length; i++) {
        if (i % 2 === 0) {
            out = out.concat(new Array(disk[i]).fill(file_idx));
            file_idx++;
        } else {
            out = out.concat(new Array(disk[i]).fill("."));
        }
    }

    return out;
}

function swap(arr: (number | string)[]) {
    let l = 0;
    let r = arr.length - 1;

    while (l < r) {
        if (arr[l] === ".") {
            while (r > l && arr[r] === ".") {
                r--;
            }
            arr[l] = arr[r];
            arr[r] = ".";
            r--;
        }
        l++;
    }
}

function isInt(num: unknown): num is number {
    return Number.isInteger(num);
}

describe("disk fragmenter", () => {
    test("Should have a file checksum of 6279058075753", async () => {
        const result = await main();
        expect(result).toEqual(6279058075753);
    });
});
