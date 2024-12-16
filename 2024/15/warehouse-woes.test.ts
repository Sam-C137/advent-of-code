import * as path from "node:path";
import * as u from "utils";
import { describe, expect, test } from "bun:test";

const ROBOT = "@";
const WALL = "#";
const BOX = "O";
const SPACE = ".";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const [grid, movement] = parse_input(text);
    const robot = find_robot(grid);
    move_robot(grid, movement, robot);
    const out: number[] = [];

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === BOX) out.push(100 * r + c);
        }
    }

    return out.reduce(u.sum_callback);
}

function parse_input(text: string): [string[][], string] {
    const [grid, inst] = text.split(/\n\s+/);
    return [
        grid.split(/\n/).map((l) => l.trim().split("")),
        inst
            .split(/\n/)
            .map((i) => i.trim())
            .join(""),
    ];
}

function find_robot(grid: string[][]): string {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === ROBOT) return [r, c].toTuple();
        }
    }

    return `${1},${1}`;
}

function move_robot(grid: string[][], movement: string, robot: string) {
    let [r, c] = robot.fromTuple();

    for (const move of movement) {
        const dr =
            new Map([
                ["^", -1],
                ["v", 1],
            ]).get(move) ?? 0;
        const dc =
            new Map([
                ["<", -1],
                [">", 1],
            ]).get(move) ?? 0;
        const targets: string[] = [robot];
        let cr = r;
        let cc = c;
        let go = true;
        while (true) {
            cr += dr;
            cc += dc;
            const char = grid[cr][cc];
            if (char === WALL) {
                go = false;
                break;
            }
            if (char === BOX) {
                targets.push([cr, cc].toTuple());
            }
            if (char === SPACE) {
                break;
            }
        }

        if (!go) continue;
        grid[r][c] = SPACE;
        grid[r + dr][c + dc] = ROBOT;
        for (let i = 1; i < targets.length; i++) {
            const [br, bc] = targets[i].fromTuple();
            grid[br + dr][bc + dc] = BOX;
        }

        r += dr;
        c += dc;
    }
}

describe("warehouse woes", () => {
    test("It should have a gps coordinate sum of 1463512", async () => {
        const result = await main();
        expect(result).toEqual(1463512);
    });
});
