async function main() {
    const file = Bun.file("input.txt");
    const sequence = await file.text();

    let l = 0;
    let seen = new Map<string, number>();

    for (let r = 0; r < sequence.length; r++) {
        if (seen.has(sequence[r])) {
            l = Math.max(l, (seen.get(sequence[r]) || 0) + 1);
        }

        seen.set(sequence[r], r);

        if (r - l + 1 === 14) return r + 1;
    }
}

try {
    const solution = await main();
    console.log(`The first marker occurs after: ${solution} characters`);
} catch (e) {
    e instanceof Error
        ? console.error(e.message)
        : console.error(JSON.stringify(e));
}
