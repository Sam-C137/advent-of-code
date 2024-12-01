const direction = ["L", "U", "R", "D"] as const;
type Direction = (typeof direction)[number];
type Coords = [number, number];
const MAX_LENGTH = 10;

async function main() {
    const file = Bun.file("input.txt");
    const text = await file.text();
    const lines = text.split(/\n/);
    const seen: string[] = [];
    const rope: Coords[] = new Array(MAX_LENGTH).fill(null).map(() => [0, 0]);

    for (const line of lines) {
        const [dir, steps] = parse(line);
        traverse(rope, dir, steps, seen);
    }

    return new Set(seen).size;
}

function parse(text: string): [Direction, number] {
    const split = text.split(" ");
    return [split[0] as Direction, Number(split[1])];
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
    rope: Coords[],
    dir: Direction,
    steps: number,
    seen: string[],
) {
    for (let i = 0; i < steps; i++) {
        rope[0][0] += dx[dir];
        rope[0][1] += dy[dir];

        for (let j = 0; j < MAX_LENGTH - 1; j++) {
            const curr = rope[j];
            const next = rope[j + 1];

            const diff_x = curr[0] - next[0];
            const diff_y = curr[1] - next[1];

            if (Math.abs(diff_x) > 1 || Math.abs(diff_y) > 1) {
                if (diff_x === 0) {
                    next[1] += diff_y > 0 ? 1 : -1;
                } else if (diff_y === 0) {
                    next[0] += diff_x > 0 ? 1 : -1;
                } else {
                    next[0] += diff_x > 0 ? 1 : -1;
                    next[1] += diff_y > 0 ? 1 : -1;
                }
            }
        }

        seen.push(JSON.stringify(rope.at(-1)));
    }
}

try {
    const result = await main();
    console.log(`The total number of visited positions are ${result}`);
} catch (e) {
    console.error(e);
}
