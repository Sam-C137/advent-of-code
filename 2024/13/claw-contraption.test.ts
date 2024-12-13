import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const machines = text.split(/\n\s+/).map((m) => m.trim());
    const instructions = get_instructions(machines);
    let total = 0;

    for (const instruction of instructions) {
        let min_score = Infinity;
        const {
            button_a: [ax, ay],
            button_b: [bx, by],
            target: [px, py],
        } = instruction;
        for (let i = 0; i <= 100; i++) {
            for (let j = 0; j <= 100; j++) {
                if (ax * i + bx * j === px && ay * i + by * j === py) {
                    min_score = Math.min(min_score, i * 3 + j);
                }
            }
        }
        if (min_score !== Infinity) total += min_score;
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
        const target = lines[2].match(/\d+/g)?.map(Number) as [X, Y];
        return {
            button_a,
            button_b,
            target,
        };
    });
}

describe("claw contraption", () => {
    test("It should have a total of 39996 fewest possible tokens to reach the target price", async () => {
        const result = await main();
        expect(result).toEqual(39996);
    });
});
