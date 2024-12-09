import * as path from "node:path";
import { describe, expect, test } from "bun:test";

class Chunk {
    value: number;

    constructor(
        value: string | number,
        public start: number,
        public length: number,
    ) {
        this.value = Number(value);
    }
}

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

function swap(arr: (number | string)[]): void {
    let chunks: Chunk[] = [];
    let i = arr.length - 1;

    while (i >= 0) {
        if (arr[i] !== ".") {
            let start = i;
            let value = arr[i];
            while (i >= 0 && arr[i] === value) {
                i--;
            }
            chunks.push(new Chunk(value, start, start - i));
        } else {
            i--;
        }
    }

    for (const chunk of chunks) {
        let l = 0;
        while (l < chunk.start) {
            let dot_count = 0;
            let dot_start = l;
            while (l < chunk.start && arr[l] === ".") {
                dot_count++;
                l++;
            }

            if (dot_count >= chunk.length) {
                for (let j = 0; j < chunk.length; j++) {
                    arr[dot_start + j] = chunk.value;
                    arr[chunk.start - j] = ".";
                }
                break;
            }

            while (l < chunk.start && arr[l] !== ".") {
                l++;
            }
        }
    }
}

function isInt(num: unknown): num is number {
    return Number.isInteger(num);
}

describe("file system fragmentation", () => {
    test("Should have a file checksum of 6301361958738", async () => {
        const result = await main();
        expect(result).toEqual(6301361958738);
    });
});
