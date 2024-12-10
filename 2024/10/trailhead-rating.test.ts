import * as path from "node:path";
import { describe, expect, test } from "bun:test";

interface Point {
    r: number;
    c: number;
}

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const trail_heads = new Set<Point>();
    const grid = get_grid(text);
    mark_trail_heads(grid, trail_heads);
    let count = 0;

    for (const { r, c } of trail_heads) {
        count += score(grid, r, c);
    }

    return count;
}

function get_grid(input: string): number[][] {
    return input.split(/\n/).map((str) => str.trim().split("").map(Number));
}

function mark_trail_heads(grid: number[][], seen: Set<Point>) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === 0)
                seen.add({
                    r,
                    c,
                });
        }
    }
}

const dir = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
];

function score(grid: number[][], r: number, c: number) {
    const q: Point[] = [{ r, c }];
    const seen = new Map<string, number>([[`${r},${c}`, 1]]);
    let trails = 0;

    while (q.length > 0) {
        const { c, r } = q.shift() as Point;
        if (grid[r][c] === 9) {
            trails += seen.get(`${r},${c}`) ?? 0;
        }
        for (const [dr, dc] of dir) {
            const nc = c + dc;
            const nr = r + dr;
            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) {
                continue;
            }
            if (grid[nr][nc] - grid[r][c] !== 1) {
                continue;
            }
            if (seen.has(`${nr},${nc}`)) {
                seen.set(
                    `${nr},${nc}`,
                    (seen.get(`${nr},${nc}`) ?? 1) +
                        (seen.get(`${r},${c}`) ?? 0),
                );
                continue;
            }
            seen.set(`${nr},${nc}`, seen.get(`${r},${c}`) ?? 0);
            q.push({
                c: nc,
                r: nr,
            });
        }
    }

    return trails;
}

describe("trailhead rating", () => {
    test("Should have a total trailhead rating of 1380", async () => {
        const result = await main();
        expect(result).toEqual(1380);
    });
});
