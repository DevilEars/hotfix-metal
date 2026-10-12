/**
 * Converts an angle in radians to a unit 2D vector. Angle `0` points along
 * `+X`, and a positive angle turns towards `+Y` (counter-clockwise, since
 * the world is Y-up). This is the inverse of `vectorToRadians`.
 *
 * @param radians - The angle in radians to convert.
 * @returns The corresponding 2D vector. (magnitude is 1)
 */
export function radiansToVector(radians) {
    return { x: Math.cos(radians), y: Math.sin(radians) };
}
