const fullTurn = Math.PI * 2;
const spawnShapeSamplers = {
    point: () => ({ x: 0, y: 0 }),
    circle: ({ radius }, random) => {
        // The square root spreads points evenly over the circle's area; a plain
        // random distance would bunch them up near the center.
        const distance = radius * Math.sqrt(random.randomFloat(0, 1));
        const angle = random.randomFloat(0, fullTurn);
        return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
    },
    ring: ({ radius }, random) => {
        const angle = random.randomFloat(0, fullTurn);
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    },
    box: ({ width, height }, random) => ({
        x: random.randomFloat(-width / 2, width / 2),
        y: random.randomFloat(-height / 2, height / 2),
    }),
};
/**
 * Picks a random point inside `shape`, relative to the shape's center.
 * @param shape - The shape to pick a point in.
 * @param random - The random instance used to pick the point.
 * @returns The picked point, as an offset from the shape's center.
 */
export function sampleSpawnShape(shape, random) {
    return sampleSpawnShapeOfType(shape, random);
}
function sampleSpawnShapeOfType(shape, random) {
    const sampler = spawnShapeSamplers[shape.type];
    return sampler(shape, random);
}
