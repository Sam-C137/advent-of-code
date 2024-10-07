async function main() {
    const file = Bun.file("input.txt");
    const text = await file.text();
    const [stack, instructions] = text.split(/\n\s*\n/);

    const parsed_instructions = parse_instructions(instructions);
    const parsed_stack = parse_stacks(stack);

    parsed_instructions.forEach((inst) => {
        const [count, from, to] = inst;
        move(count, parsed_stack[Number(from)], parsed_stack[Number(to)]);
    });

    let out_str = "";

    for (const value of Object.values(parsed_stack)) {
        out_str += value.at(value.length - 1);
    }

    return out_str;
}

function move(count: number, from: unknown[], to: unknown[]) {
    for (let i = 0; i < count; i++) {
        to.push(from.pop());
    }
}

function parse_stacks(input: string) {
    const lines = input.split(/\n/);
    const temp = lines[lines.length - 1].match(/\d+/g) || [];
    const num_of_stacks = Math.max(...temp.map(Number));

    const stack: string[][] = new Array(num_of_stacks).fill(null).map(() => []);

    // bottom to top ignoring line with the number label
    for (let i = lines.length - 2; i >= 0; i--) {
        const line = lines[i];
        for (let j = 0; j < num_of_stacks; j++) {
            const char = line[j * 4 + 1]; //each crate is 4 characters wide
            if (char && char !== " ") stack[j].push(char);
        }
    }

    const out: Record<number, string[]> = {};

    stack.forEach((s, i) => {
        out[i + 1] = s;
    });

    return out;
}

function parse_instructions(input: string) {
    const lines = input.split(/\n/).filter(Boolean);

    const out: [number, string, string][] = new Array(lines.length)
        .fill(null)
        .map(() => [0, "", ""]);

    lines.forEach((line, index) => {
        const move_count = line
            .match(/move\s\d+/g)
            ?.at(0)
            ?.split(/\s/)
            .at(1);
        out[index][0] = Number(move_count);

        const from = line
            .match(/from\s\d+/g)
            ?.at(0)
            ?.split(/\s/)
            .at(1);
        out[index][1] = String(from);

        const to = line
            .match(/to\s\d+/g)
            ?.at(0)
            ?.split(/\s/)
            .at(1);
        out[index][2] = String(to);
    });

    return out;
}

try {
    const solution = await main();
    console.log(`The crates at the top of each stack form: ${solution}`);
} catch (e) {
    e instanceof Error
        ? console.error(e.message)
        : console.error(JSON.stringify(e));
}
