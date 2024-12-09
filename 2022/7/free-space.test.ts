import * as path from "node:path";
import { describe, expect, test } from "bun:test";

async function main() {
    const file = Bun.file(path.join(__dirname, "input.txt"));
    const text = await file.text();
    const lines = text.split(/\n/).map((l) => l.trim());

    let sum = 0;
    let directory: Record<string, { size: number }> = {
        "/": {
            size: 0,
        },
    };
    let current_dir = ["/"];

    lines.forEach((line) => {
        const [marker, command, target] = line.split(" ");

        if (marker === "dir") return;
        else if (marker === "$") {
            if (command === "cd") {
                if (target === "..") {
                    current_dir.pop();
                } else {
                    current_dir.push(target);
                    const path = current_dir.join("/");
                    directory[path] = {
                        size: 0,
                    };
                }
            }
        } else {
            const size = Number(marker);
            const temp: string[] = [];
            current_dir.forEach((dir) => {
                temp.push(dir);
                const cwd = temp.join("/");
                directory[cwd].size += size;
            });
        }
    });

    const size_to_free = directory["/"].size - 70000000 + 30000000;
    let closest_size = 70000000;

    for (const dir in directory) {
        const size = directory[dir].size;
        if (size > size_to_free && size < closest_size) {
            closest_size = size;
        }
    }

    return closest_size;
}

try {
    const total = await main();
    console.log("The total size of the smallest directory to free is:", total);
} catch (e) {
    console.error(e);
}

describe("directory", () => {
    test("Total size of the smallest directory to free to be 7991939", async () => {
        const result = await main();
        expect(result).toEqual(7991939);
    });
});
