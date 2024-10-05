async function main() {
    const file = Bun.file("input.txt");
    const text = await file.text();

    const elves = text.split(/\n\s*\n/);

    const calories = elves.map((e) => {
        return e
            .split(/\n/)
            .map(Number)
            .reduce((a, b) => a + b);
    });

    /**
     * sorting might be inefficient
     *
     *     calories.sort((a, b) => a - b);
     *
     *     return calories[calories.length - 1];
     */

    let max = calories[0];

    for (const c of calories) {
        max = Math.max(c, max);
    }

    return max;
}

try {
    const maxCalories = await main();
    console.log(`The max calories carried by an elf is: ${maxCalories}`);
} catch (e) {
    e instanceof Error
        ? console.error(e.message)
        : console.error(JSON.stringify(e));
}
