import path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const [patterns, designs] = parse_input(text);
    const max_length = Math.max(...[...patterns].map((_) => _.length));

    return designs.reduce((prev, curr) => {
        return prev + make_pattern(curr, max_length, patterns);
    }, 0);
}

const map = new Map<string, number>();

function make_pattern(
    design: string,
    max_length: number,
    patterns: Set<string>,
) {
    if (map.has(design)) {
        return map.get(design) ?? 0;
    }

    if (design === "") {
        map.set(design, 1);
        return 1;
    }

    let count = 0;

    for (let i = 0; i < Math.min(max_length, design.length) + 1; i++) {
        if (patterns.has(design.slice(0, i))) {
            count += make_pattern(design.slice(i), max_length, patterns);
        }
    }

    map.set(design, count);
    return count;
}

function parse_input(text: string): [Set<string>, string[]] {
    const [towels, patterns] = text.split(/\n\s+/).map((_) => _.trim());

    return [
        new Set(towels.split(", ")),
        patterns.split(/\n/).map((_) => _.trim()),
    ];
}

describe("linen layout", () => {
    test("It should have a total number of 712058625427487 distinct ways to make designs", async () => {
        const result = await main();
        expect(result).toEqual(290);
    });
});
