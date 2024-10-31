async function main() {
    const file = Bun.file("input.txt");
    const text = await file.text();

    const lines = text.split(/\n/);
    const transformed_lines = parse(lines);

    let total =
        transformed_lines[0].length +
        transformed_lines[transformed_lines.length - 1].length;

    for (let row_idx = 0; row_idx < transformed_lines.length; row_idx++) {
        if (row_idx === 0) continue;

        if (row_idx === transformed_lines.length - 1) continue;

        const line = transformed_lines[row_idx];

        line.forEach((current, idx) => {
            if (idx !== 0 && idx !== line.length - 1) {
                const col: number[] = [];

                for (let j = 0; j < transformed_lines.length; j++) {
                    col.push(transformed_lines[j][idx]);
                }

                let is_small_tb = true;
                let is_small_bt = true;
                let is_small_ltr = true;
                let is_small_rtl = true;

                for (let j = 0; j < row_idx; j++) {
                    if (col[j] >= current) {
                        is_small_tb = false;
                        break;
                    }
                }

                for (let j = row_idx + 1; j < col.length; j++) {
                    if (col[j] >= current) {
                        is_small_bt = false;
                        break;
                    }
                }

                for (let j = 0; j < idx; j++) {
                    if (line[j] >= current) {
                        is_small_ltr = false;
                        break;
                    }
                }

                for (let j = idx + 1; j < line.length; j++) {
                    if (line[j] >= current) {
                        is_small_rtl = false;
                        break;
                    }
                }

                if (is_small_tb || is_small_bt || is_small_rtl || is_small_ltr)
                    total++;
            } else {
                total++;
            }
        });
    }

    return total;
}

function parse(lines: string[]): number[][] {
    const out: number[][] = [];

    lines.forEach((line) => {
        out.push(line.trim().split("").map(Number));
    });

    return out;
}

try {
    const result = await main();
    console.log(`The total number of visible trees are ${result}`);
} catch (e) {
    console.error(e);
}
