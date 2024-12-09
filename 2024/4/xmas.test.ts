import { describe, expect, test } from "bun:test";
import * as path from "node:path";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const lines = text
        .split(/\n/)
        .map((l) => l.trim())
        .map((str) => str.split(""));

    return count(lines);
}

function count(grid: string[][]): number {
    const word = "XMAS";
    const reversed = word.split("").reverse().join("");
    let count = 0;
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 1],
    ];

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            for (const [dr, dc] of directions) {
                let sequence = "";
                const end_r = r + (word.length - 1) * dr;
                const end_c = c + (word.length - 1) * dc;

                if (
                    end_r < 0 ||
                    end_r >= grid.length ||
                    end_c < 0 ||
                    end_c >= grid[r].length
                ) {
                    continue;
                }

                for (let k = 0; k < word.length; k++) {
                    const new_r = r + k * dr;
                    const new_c = c + k * dc;
                    sequence += grid[new_r][new_c];
                }

                if (sequence === word || sequence === reversed) {
                    count++;
                }
            }
        }
    }

    return count;
}

describe("xmas", () => {
    test("Total number of XMAS occurrences to be 2545", async () => {
        const result = await main();
        expect(result).toEqual(2545);
    });
});
