export async function main() {
    const file = Bun.file("input.txt");
    const text = await file.text();
    const lines = text.split(/\n/);
    const transformed_lines = parse(lines);

    const total_scenic: number[] = [];

    for (let row_idx = 0; row_idx < transformed_lines.length; row_idx++) {
        const line = transformed_lines[row_idx];

        line.forEach((current, idx) => {
            const col: number[] = [];
            for (let j = 0; j < transformed_lines.length; j++) {
                col.push(transformed_lines[j][idx]);
            }

            const path: [number, number, number, number] = [0, 0, 0, 0];
            traverse_col(current, path, row_idx, col);
            traverse_row(current, path, idx, line);
            total_scenic.push(path.reduce((a, b) => a * b));
        });
    }

    return total_scenic.sort((a, b) => a - b).at(-1);
}

function parse(lines: string[]): number[][] {
    const out: number[][] = [];

    lines.forEach((line) => {
        out.push(line.trim().split("").map(Number));
    });

    return out;
}

function traverse_col<T extends [number, number, number, number]>(
    target: number,
    path: T,
    row_idx: number,
    col: number[],
): T {
    for (let i = row_idx - 1; i >= 0; i--) {
        path[0]++;
        if (col[i] >= target) break;
    }

    for (let i = row_idx + 1; i < col.length; i++) {
        path[1]++;
        if (col[i] >= target) break;
    }

    return path;
}

function traverse_row<T extends [number, number, number, number]>(
    target: number,
    path: T,
    idx: number,
    row: number[],
): T {
    for (let i = idx - 1; i >= 0; i--) {
        path[2]++;
        if (row[i] >= target) break;
    }

    for (let i = idx + 1; i < row.length; i++) {
        path[3]++;
        if (row[i] >= target) break;
    }

    return path;
}

try {
    const result = await main();
    console.log(`The greatest scenic score is ${result}`);
} catch (e) {
    console.error(e);
}
