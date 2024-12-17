import path from "node:path";
import * as u from "utils";
import { describe, expect, test } from "bun:test";

const START = "S";
const END = "E";
const WALL = "#";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const [grid, start] = parse_input(text);
    const pq = new u.MinHeap<string>();
    pq.insert([0, ...start.fromTuple(), 0, 1].toTuple());
    const seen = new Set<string>([[...start.fromTuple(), 0, 1].toTuple()]);

    while (pq.length) {
        const [cost, r, c, dr, dc] = pq.delete()!.fromTuple();
        seen.add([r, c, dr, dc].toTuple());
        if (grid[r][c] === END) {
            return cost;
        }
        for (const move of [
            [cost + 1, r + dr, c + dc, dr, dc].toTuple(),
            [cost + 1000, r, c, dc, -dr].toTuple(),
            [cost + 1000, r, c, -dc, dr].toTuple(),
        ]) {
            const [new_cost, nr, nc, ndr, ndc] = move.fromTuple();
            if (grid[nr][nc] === WALL) continue;
            if (seen.has([nr, nc, ndr, ndc].toTuple())) continue;
            pq.insert([new_cost, nr, nc, ndr, ndc].toTuple());
        }
    }
}

function parse_input(text: string): [string[][], string] {
    var start;

    return [
        text.split(/\n/).map((line, idx) => {
            if (line.includes(START)) {
                start = [idx, line.indexOf(START)].toTuple();
            }
            return line.trim().split("");
        }),
        start!,
    ];
}

describe("reindeer maze", () => {
    test("It should have a shortest path cost of 90440", async () => {
        const result = await main();
        expect(result).toEqual(90440);
    });
});
