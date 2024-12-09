import * as path from "node:path";

const instruction_mapping = {
    noop: 1,
    addx: 2,
};

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const lines = text.split(/\n/);
    const out = [];

    let x = 1;
    let inst = 0;
    let cycle = 0;
    while (cycle < 220) {
        cycle++;

        if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
            out.push(cycle * x);
            console.log(`${cycle}th cycle: `, cycle * x, "x val: ", x);
        }

        if (inst > 0) {
            inst--;
            continue;
        }
        const line = lines.shift();
        if (!line) continue;
        const [_inst, amount] = parse(line);
        // console.log([_inst, amount]);
        inst = _inst - 1;
        x += amount ?? 0;
        console.log(
            "itter: ",
            cycle,
            "x: ",
            x,
            "amount: ",
            amount,
            "cycle: ",
            line.split(" ")[0].trim(),
        );
    }

    return out.reduce((a, b) => a + b);
}

function parse(text: string): [number, number?] {
    const split = text.split(" ").map((foo) => foo.trim());

    return [
        instruction_mapping[split[0] as keyof typeof instruction_mapping],
        split[1] ? Number(split[1]) : undefined,
    ];
}

console.log("finally: ", await main());
