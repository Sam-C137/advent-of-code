import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();

    const rounds = text.split(/\n/).filter(Boolean);

    let total_score = 0;

    rounds.forEach((r) => {
        const [opponent, me] = r.split(/\s/) as [
            keyof typeof piece_mapper,
            keyof typeof outcome,
        ];

        total_score += outcome[me] + reverse_play(opponent, me);
    });

    return total_score;
}

function reverse_play<
    T extends keyof typeof piece_mapper,
    U extends keyof typeof outcome,
>(opponent: T, result: U): number {
    switch (result) {
        case "X":
            return shape_score[winning_combinations[piece_mapper[opponent]]];
        case "Z":
            return shape_score[losing_combinations[piece_mapper[opponent]]];
        default:
            return shape_score[piece_mapper[opponent]];
    }
}

const outcome = {
    X: 0,
    Y: 3,
    Z: 6,
} as const;

const piece_mapper = {
    A: "rock",
    B: "paper",
    C: "scissors",
} as const;

const shape_score = {
    rock: 1,
    paper: 2,
    scissors: 3,
} as const;

const winning_combinations = {
    rock: "scissors",
    scissors: "paper",
    paper: "rock",
} as const;

const losing_combinations = {
    scissors: "rock",
    paper: "scissors",
    rock: "paper",
} as const;

describe("rock, paper, scissors: part 2", () => {
    test("Your total score to be 9541", async () => {
        const result = await main();
        expect(result).toEqual(9541);
    });
});
