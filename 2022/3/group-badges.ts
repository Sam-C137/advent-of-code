async function main() {
    const file = Bun.file("input.txt");
    const text = await file.text();

    const sacks = text.split(/\n/).filter(Boolean);

    const groups: string[][] = [];

    for (let i = 0; i < sacks.length; i += 3) {
        groups.push(sacks.slice(i, i + 3));
    }

    let total_priority = 0;

    groups.forEach((g) => {
        const badge = similarity(g[0], g[1], g[2]);
        total_priority += priority(Array.from(badge)[0]);
    });

    return total_priority;
}

function priority(char: string) {
    if (char.charCodeAt(0) > 96) {
        return char.charCodeAt(0) - 96;
    }

    return char.charCodeAt(0) - 38;
}

function similarity(str1: string, str2: string, str3: string) {
    const set1 = new Set(str1);
    const set2 = new Set(str2);
    const set3 = new Set(str3);

    return set1.intersection(set2).intersection(set3);
}

try {
    const total = await main();
    console.log(`The total priority is: ${total}`);
} catch (e) {
    e instanceof Error
        ? console.error(e.message)
        : console.error(JSON.stringify(e));
}
