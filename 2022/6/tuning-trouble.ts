async function main() {
    const file = Bun.file("input.txt");
    const sequence = await file.text();

    let left = 0;
    const seen = new Set(sequence[left]);

    for (let right = 1; right < sequence.length; right++) {
        if (seen.has(sequence[right])) {
            left = right;
            seen.clear();
        } else {
            seen.add(sequence[right]);
        }

        if (seen.size === 4) {
            return right;
        }
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
