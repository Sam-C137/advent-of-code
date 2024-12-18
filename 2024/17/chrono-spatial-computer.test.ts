import path from "node:path";
import { describe, expect, test } from "bun:test";

interface Register {
    a: number;
    b: number;
    c: number;
}

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    let [{ a, b, c }, prog] = parse_input(text);

    let ptr = 0;
    const out: number[] = [];

    while (ptr < prog.length) {
        const inst = prog[ptr];
        const operand = prog[ptr + 1];

        switch (inst) {
            //adv
            case 0:
                a = a >> combo(operand, { a, b, c }); // a = Math.floor((a / Math.pow(2, combo(operand, {a, b, c}))))
                break;
            // bxl
            case 1:
                b = b ^ operand;
                break;
            // bst
            case 2:
                b = combo(operand, { a, b, c }) % 8;
                break;
            // jnz
            case 3:
                if (a !== 0) {
                    ptr = operand;
                    continue;
                }
                break;
            // bxc
            case 4:
                b = b ^ c;
                break;
            // out
            case 5:
                out.push(combo(operand, { a, b, c }) % 8);
                break;
            // bdv
            case 6:
                b = a >> combo(operand, { a, b, c });
                break;
            // cdv
            case 7:
                c = a >> combo(operand, { a, b, c });
                break;
            default:
                break;
        }
        ptr += 2;
    }

    return out.join(",");
}

function combo(value: number, reg: Register) {
    if (value <= 3) return value;
    if (value === 4) return reg.a;
    if (value === 5) return reg.b;
    if (value === 6) return reg.c;

    throw new Error("foo");
}

function parse_input(text: string): [Register, number[]] {
    const [register, inst] = text.split(/\n\s+/);
    const reg = register.match(/\d+/g)?.map(Number) as number[];

    return [
        {
            a: reg[0],
            b: reg[1],
            c: reg[2],
        },
        inst.match(/\d+/g)?.map(Number) as number[],
    ];
}

describe("chrono-spatial computer", () => {
    test("It should have a program output of 7,1,3,7,5,1,0,3,4", async () => {
        const result = await main();
        expect(result).toEqual("7,1,3,7,5,1,0,3,4");
    });
});
