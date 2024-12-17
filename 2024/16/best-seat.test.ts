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
    const lowest_cost = new Map<string, number>([
        [[...start.fromTuple(), 0, 1].toTuple(), 0],
    ]);
    const back_track = new Map<string, Set<string>>();
    let best_cost = Infinity;
    const end_states = new Set<string>();

    while (pq.length) {
        const [cost, r, c, dr, dc] = pq.delete()!.fromTuple();
        if (cost > (lowest_cost.get([r, c, dr, dc].toTuple()) ?? Infinity))
            continue;
        lowest_cost.set([r, c, dr, dc].toTuple(), cost);
        if (grid[r][c] === END) {
            if (cost > best_cost) break;
            best_cost = cost;
            end_states.add([r, c, dr, dc].toTuple());
        }

        for (const move of [
            [cost + 1, r + dr, c + dc, dr, dc].toTuple(),
            [cost + 1000, r, c, dc, -dr].toTuple(),
            [cost + 1000, r, c, -dc, dr].toTuple(),
        ]) {
            const [new_cost, nr, nc, ndr, ndc] = move.fromTuple();
            if (grid[nr][nc] === WALL) continue;
            const lowest =
                lowest_cost.get([nr, nc, ndr, ndc].toTuple()) ?? Infinity;
            if (new_cost > lowest) continue;
            if (new_cost < lowest) {
                back_track.set([nr, nc, ndr, ndc].toTuple(), new Set<string>());
                lowest_cost.set([nr, nc, ndr, ndc].toTuple(), new_cost);
            }
            back_track
                .get([nr, nc, ndr, ndc].toTuple())
                ?.add([r, c, dr, dc].toTuple());

            pq.insert([new_cost, nr, nc, ndr, ndc].toTuple());
        }
    }

    const q = Array.from(end_states);
    const seen = new Set(end_states);

    while (u.is_not_empty(q)) {
        const key = q.shift();
        for (const last of back_track.get(key) ?? []) {
            if (seen.has(last)) continue;
            seen.add(last);
            q.push(last);
        }
    }

    const out = new Set();

    for (const item of seen) {
        const [r, c] = item.fromTuple();
        out.add([r, c].toTuple());
    }

    return out.size;
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

describe("best seats", () => {
    test("It should have best seats with a total of 479 tiles", async () => {
        const result = await main();
        expect(result).toEqual(479);
    });
});

console.log(await main());
