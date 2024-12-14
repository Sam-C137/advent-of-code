import * as path from "node:path";
import { describe, expect, test } from "bun:test";

type X = number;
type Y = number;
interface Robot {
    p: [X, Y];
    v: [X, Y];
}
const WIDTH = 101;
const HEIGHT = 103;

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const robots = parse_input(text);
    const results: [X, Y][] = [];

    for (const {
        p: [px, py],
        v: [vx, vy],
    } of robots) {
        const x = (((px + vx * 100) % WIDTH) + WIDTH) % WIDTH;
        const y = (((py + vy * 100) % HEIGHT) + HEIGHT) % HEIGHT;
        results.push([x, y]);
    }

    const vm = Math.floor((HEIGHT - 1) / 2);
    const hm = Math.floor((WIDTH - 1) / 2);

    const quad = [0, 0, 0, 0];

    for (const [px, py] of results) {
        if (px === hm || py === vm) continue;
        if (px < hm) {
            if (py < vm) {
                quad[0]++;
            } else {
                quad[1]++;
            }
        } else {
            if (py < vm) {
                quad[2]++;
            } else {
                quad[3]++;
            }
        }
    }

    return quad.reduce((a, b) => a * b, 1);
}

function parse_input(text: string): Robot[] {
    return text.split(/\n/).map((t) => {
        const [p, v] = t.trim().split(" ");

        return {
            p: p.slice(2).split(",").map(Number),
            v: v.slice(2).split(",").map(Number),
        } as Robot;
    });
}

function print_grid(result: [X, Y][]) {
    const grid = [];
    for (let i = 0; i < HEIGHT; i++) {
        grid[i] = new Array(WIDTH).fill(".");
    }

    for (const [px, py] of result) {
        Number.isInteger(grid[py][px]) ? grid[py][px]++ : (grid[py][px] = 1);
    }

    for (const row of grid) {
        console.log(JSON.stringify(row));
    }
}

describe("restroom redoubt", () => {
    test("The safety factor after 100 secs should be 214400550", async () => {
        const result = await main();
        expect(result).toEqual(214400550);
    });
});
