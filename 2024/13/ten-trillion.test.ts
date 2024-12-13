import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const machines = text.split(/\n\s+/).map((m) => m.trim());
    const instructions = get_instructions(machines);
    let total = 0;

    for (const instruction of instructions) {
        const {
            button_a: [ax, ay],
            button_b: [bx, by],
            target: [px, py],
        } = instruction;
        // a few linear algebras later
        const ca = (px * by - py * bx) / (ax * by - ay * bx);
        const cb = (px - ax * ca) / bx;
        if (Number.isInteger(ca) && Number.isInteger(cb)) {
            total += ca * 3 + cb;
        }
    }

    return total;
}

type X = number;
type Y = number;

interface Instruction {
    button_a: [X, Y];
    button_b: [X, Y];
    target: [X, Y];
}

function get_instructions(machines: string[]): Instruction[] {
    return machines.map((m) => {
        const lines = m.split(/\n/);
        const button_a = lines[0].match(/\d+/g)?.map(Number) as [X, Y];
        const button_b = lines[1].match(/\d+/g)?.map(Number) as [X, Y];
        const target = lines[2]
            .match(/\d+/g)
            ?.map(Number)
            .map((t) => t + 10000000000000) as [X, Y];

        return {
            button_a,
            button_b,
            target,
        };
    });
}

describe("claw contraption with 10000000000000 + target", () => {
    test("It should have a total of 73267584326867 fewest possible tokens to reach the target price", async () => {
        const result = await main();
        expect(result).toEqual(73267584326867);
    });
});
