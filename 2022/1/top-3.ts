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

    calories.sort((a, b) => a - b);

    return calories.slice(-3).reduce((a, b) => a + b);
}

try {
    const maxCalories = await main();
    console.log(
        `The total calories carried by the top 3 elves is: ${maxCalories}`,
    );
} catch (e) {
    e instanceof Error
        ? console.error(e.message)
        : console.error(JSON.stringify(e));
}
