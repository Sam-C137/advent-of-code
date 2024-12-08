const OBSTACLE = "#";
const GUARD = "^";
const SPACE = ".";

interface Point {
    c: number;
    r: number;
}

async function main() {
    const file = Bun.file("input.txt");
    const text = await file.text();
    const lines = text.split(/\n/).map((l) => l.trim());
    const [maze, start] = get_maze(lines);

    const seen: boolean[][] = [];
    const path: Point[] = [];

    for (let i = 0; i < maze.length; i++) {
        seen.push(new Array(maze[0].length).fill(false));
    }

    walk(maze, start, seen, path);

    let loop_count = 0;

    for (const { c, r } of path) {
        if (maze[r][c] !== SPACE) {
            continue;
        }

        maze[r][c] = OBSTACLE;

        if (loops(maze, start)) {
            loop_count++;
        }

        maze[r][c] = SPACE;
    }

    return loop_count;
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

function loops(grid: string[][], { c, r }: Point) {
    let dr = -1;
    let dc = 0;

    const seen = new Set();

    while (true) {
        seen.add(`${r},${c},${dc},${dr}`);

        if (
            r + dr < 0 ||
            r + dr >= grid.length ||
            c + dc < 0 ||
            c + dc >= grid[0].length
        ) {
            return false;
        }

        if (grid[r + dr][c + dc] === OBSTACLE) {
            [dc, dr] = [-dr, dc];
        } else {
            r += dr;
            c += dc;
        }

        if (seen.has(`${r},${c},${dc},${dr}`)) {
            return true;
        }
    }
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

try {
    const result = await main();
    console.log(`The total number of positions that create loops: ${result}`);
} catch (e) {
    console.error(e);
}
