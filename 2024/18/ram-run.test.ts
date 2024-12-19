import path from "node:path";
import * as u from "utils";
import { describe, expect, test } from "bun:test";

const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
] as const;

const GRID_SIZE = 71;
const MAX_BYTES = 1024;

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const grid = get_grid(text);
    const pq = new u.MinHeap<string>();
    pq.insert([0, 0, 0].toTuple());
    const seen = new Set<string>([[0, 0].toTuple()]);
    const distances: number[][] = new Array(GRID_SIZE)
        .fill(null)
        .map((_) => new Array(GRID_SIZE).fill(Infinity));
    distances[0][0] = 0;

    while (pq.length) {
        const [d, r, c] = pq.delete()!.fromTuple();

        if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) {
            return d;
        }

        if (d > distances[r][c]) continue;

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length)
                continue;

            if (grid[nr][nc] === "#") continue;

            if (seen.has([nr, nc].toTuple())) continue;

            const nd = d + 1;
            if (nd < distances[nr][nc]) {
                distances[nr][nc] = nd;
                pq.insert([nd, nr, nc].toTuple());
                seen.add([nr, nc].toTuple());
            }
        }
    }
}

function get_grid(input: string): string[][] {
    const inst = input.split(/\n/).map((n) => n.trim().split(",").map(Number));

    const out: string[][] = new Array(GRID_SIZE)
        .fill(null)
        .map((_) => new Array(GRID_SIZE).fill("."));

    for (let i = 0; i < MAX_BYTES; i++) {
        const [r, c] = inst[i];
        out[r][c] = "#";
    }

    return out;
}

describe("ram run", () => {
    test("It should have a shortest path of 364 points", async () => {
        const result = await main();
        expect(result).toEqual(364);
    });
});
