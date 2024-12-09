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
            keyof typeof piece_mapper,
        ];

        const [, my_score] = play(opponent, me);
        total_score += my_score + shape_score[piece_mapper[me]];
    });

    return total_score;
}

const piece_mapper = {
    A: "rock",
    X: "rock",
    B: "paper",
    Y: "paper",
    C: "scissors",
    Z: "scissors",
} as const;

const shape_score = {
    rock: 1,
    paper: 2,
    scissors: 3,
};

const winning_combinations = {
    rock: "scissors",
    scissors: "paper",
    paper: "rock",
};

function play<T extends keyof typeof piece_mapper>(
    player1: T,
    player2: T,
): [number, number] {
    const p1 = piece_mapper[player1];
    const p2 = piece_mapper[player2];

    if (p1 === p2) {
        return [3, 3];
    }

    return winning_combinations[p1] === p2 ? [6, 0] : [0, 6];
}

describe("rock, paper, scissors", () => {
    test("Your total score to be 10595", async () => {
        const result = await main();
        expect(result).toEqual(10595);
    });
});
