import { describe, expect, test } from "bun:test";
import * as _path from "node:path";

const OBSTACLE = "#";
const GUARD = "^";

interface Point {
    c: number;
    r: number;
}

async function main() {
    const file = Bun.file(_path.join(__dirname, "input.txt"));
    const text = await file.text();
    const lines = text.split(/\n/).map((l) => l.trim());
    const seen: boolean[][] = [];
    const path: Point[] = [];
    const [maze, start] = get_maze(lines);

    for (let i = 0; i < maze.length; i++) {
        seen.push(new Array(maze[0].length).fill(false));
    }

    walk(maze, start, seen, path);

    // debug(maze, path)

    return seen.reduce((prev, curr) => {
        return prev + curr.filter(Boolean).length;
    }, 0);
}

const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

function walk(
    maze: string[][],
    curr: Point,
    seen: boolean[][],
    path: Point[],
    current_direction = 0,
): void {
    if (
        curr.c < 0 ||
        curr.c >= maze[0].length ||
        curr.r < 0 ||
        curr.r >= maze.length
    ) {
        return;
    }

    if (!seen[curr.r][curr.c]) path.push(curr);
    seen[curr.r][curr.c] = true;

    const [dc, dr] = directions[current_direction];
    const next_c = curr.c + dc;
    const next_r = curr.r + dr;

    if (
        next_c >= 0 &&
        next_c < maze[0].length &&
        next_r >= 0 &&
        next_r < maze.length &&
        maze[next_r][next_c] === OBSTACLE
    ) {
        const next_direction = (current_direction + 1) % directions.length;
        current_direction = next_direction;
        const [new_dc, new_dr] = directions[next_direction];
        return walk(
            maze,
            {
                c: curr.c + new_dc,
                r: curr.r + new_dr,
            },
            seen,
            path,
            current_direction,
        );
    }

    return walk(
        maze,
        {
            c: next_c,
            r: next_r,
        },
        seen,
        path,
        current_direction,
    );
}

function get_maze(lines: string[]): [string[][], Point] {
    let start: Point = {
        c: 0,
        r: 0,
    };

    return [
        lines.map((l, idx) => {
            if (l.includes(GUARD))
                start = {
                    c: l.indexOf(GUARD),
                    r: idx,
                };
            return l.split("");
        }),
        start,
    ];
}

function debug(maze: string[][], path: Point[]) {
    function drawPath(data: string[][], path: Point[]) {
        path.forEach((p) => {
            if (data[p.r] && data[p.r][p.c]) {
                data[p.r][p.c] = "X";
            }
        });
        return data.map((d) => d.join(""));
    }
    console.log(JSON.stringify(drawPath(maze, path), null, 2));
}

describe("guard gallivant", () => {
    test("Total number of distinct positions the guard moves to be 4752", async () => {
        const result = await main();
        expect(result).toEqual(4752);
    });
});
