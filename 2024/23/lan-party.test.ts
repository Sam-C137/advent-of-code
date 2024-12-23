import path from "node:path";
import "utils";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const graph = parse_input(text);
    const seen = new Set<string>();

    for (const x of graph.keys()) {
        for (const y of graph.get(x)!) {
            for (const z of graph.get(y)!) {
                if (x !== z && graph.get(z)?.has(x)) {
                    seen.add([x, y, z].sort().serialize());
                }
            }
        }
    }

    return Array.from(seen).filter((s) =>
        s.deserialize<string[]>().some((item) => item.startsWith("t")),
    ).length;
}

function parse_input(input: string): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();

    input.split(/\n/).forEach((line) => {
        const [from, to] = line.trim().split("-");
        if (!graph.has(from)) graph.set(from, new Set());
        if (!graph.has(to)) graph.set(to, new Set());

        graph.get(from)?.add(to);
        graph.get(to)?.add(from);
    });

    return graph;
}

describe("lan party", () => {
    test("It should have a total of 1269 connections where the historian may be", async () => {
        const result = await main();
        expect(result).toEqual(1269);
    });
});
