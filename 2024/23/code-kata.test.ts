import path from "node:path";
import "utils";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const graph = parse_input(text);
    const seen = new Set<string>();

    function find(node: string, req: Set<string>) {
        const key = Array.from(req).sort().serialize();
        if (seen.has(key)) return;
        seen.add(key);

        for (const neighbour of graph.get(node) ?? []) {
            if (req.has(neighbour)) continue;
            if (!graph.get(neighbour)?.isSupersetOf(req)) continue;
            find(neighbour, req.union(new Set([neighbour])));
        }
    }

    for (const x of graph.keys()) {
        find(x, new Set([x]));
    }

    let max = "";
    for (const s of seen) {
        max = s.length > max.length ? s : max;
    }

    return max.deserialize<string[]>().join(",");
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

describe("code kata", () => {
    test("It should print a password of ad,jw,kt,kz,mt,nc,nr,sb,so,tg,vs,wh,yh not co,de,ka,ta", async () => {
        const result = await main();
        expect(result).toEqual("ad,jw,kt,kz,mt,nc,nr,sb,so,tg,vs,wh,yh");
    });
});
