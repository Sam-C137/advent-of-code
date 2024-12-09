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
    let count = 0;

    for (let r = 1; r < grid.length - 1; r++) {
        for (let c = 1; c < grid[r].length - 1; c++) {
            if (grid[r][c] !== "A") continue;

            const first = grid[r - 1][c - 1] + grid[r][c] + grid[r + 1][c + 1];
            const second = grid[r - 1][c + 1] + grid[r][c] + grid[r + 1][c - 1];

            if (
                ["MAS", "SAM"].includes(first) &&
                ["MAS", "SAM"].includes(second)
            ) {
                count++;
            }
        }
    }

    return count;
}

describe("x-mas", () => {
    test("Total number of X shaped MAS occurrences to be 1886", async () => {
        const result = await main();
        expect(result).toEqual(1886);
    });
});
