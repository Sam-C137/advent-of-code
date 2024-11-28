const direction = ["L", "U", "R", "D"] as const;
type Direction = (typeof direction)[number];
type Coords = [number, number];

async function main() {
    const file = Bun.file("input.txt");
    const text = await file.text();
    const lines = text.split(/\n/);
    const seen: string[] = [];
    const head: Coords = [0, 0];
    const tail: Coords = [0, 0];

    for (const line of lines) {
        const [dir, steps] = parse(line);
        traverse(head, tail, dir, steps, seen);
    }

    return new Set(seen).size;
}

function parse(text: string): [Direction, number] {
    const split = text.split(" ");
    isDirection(split[0]);
    return [split[0], Number(split[1])];
}

const dx: Record<Direction, number> = {
    R: 1,
    L: -1,
    U: 0,
    D: 0,
};

const dy: Record<Direction, number> = {
    R: 0,
    L: 0,
    U: 1,
    D: -1,
};

function traverse(
    head: Coords,
    tail: Coords,
    dir: Direction,
    steps: number,
    seen: string[],
) {
    for (let i = 0; i < steps; i++) {
        head[0] += dx[dir];
        head[1] += dy[dir];

        const diff_x = head[0] - tail[0];
        const diff_y = head[1] - tail[1];

        if (Math.abs(diff_x) > 1 || Math.abs(diff_y) > 1) {
            if (diff_x === 0) {
                tail[1] += diff_y > 0 ? 1 : -1;
            } else if (diff_y === 0) {
                tail[0] += diff_x > 0 ? 1 : -1;
            } else {
                tail[0] += diff_x > 0 ? 1 : -1;
                tail[1] += diff_y > 0 ? 1 : -1;
            }
        }

        seen.push(JSON.stringify(tail));
    }
}

function isDirection(str: string): asserts str is Direction {
    if (!direction.includes(str as Direction)) {
        throw new Error(str + " is not a direction");
    }
}

try {
    const result = await main();
    console.log(`The total number of visited positions are ${result}`);
} catch (e) {
    console.error(e);
}
