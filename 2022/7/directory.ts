async function main() {
    const file = Bun.file("input.txt");
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

    for (const dir in directory) {
        if (directory[dir].size <= 100000) {
            sum += directory[dir].size;
        }
    }

    return sum;
}

try {
    const total = await main();
    console.log("Total is:", total);
} catch (e) {
    console.error(e);
}
