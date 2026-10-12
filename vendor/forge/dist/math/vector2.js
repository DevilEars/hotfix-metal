/**
 * Static operations on {@link Vector2}. Mutating operations (`add`,
 * `subtract`, `multiply`, `multiplyComponents`, `divide`, `normalize`,
 * `floorComponents`, `rotate`, `perpendicular`, `negate`) mutate their
 * `target` argument in place and return it, rather than allocating a new
 * `Vector2`. Read-only operations (`magnitude`, `magnitudeSquared`, `dot`,
 * `cross`, `distanceTo`, `equals`, `toString`, `toFloat32Array`) and `clone`
 * never mutate their arguments.
 */
export class Vec2 {
    /**
     * A zero vector (0, 0). A fresh vector is created on every access, so it's
     * always safe to mutate.
     */
    static get zero() {
        return { x: 0, y: 0 };
    }
    /**
     * A vector with components of 1 (1, 1). A fresh vector is created on every
     * access, so it's always safe to mutate.
     */
    static get one() {
        return { x: 1, y: 1 };
    }
    /**
     * A unit vector pointing upward (0, 1), since the world is Y-up. A fresh
     * vector is created on every access, so it's always safe to mutate.
     */
    static get up() {
        return { x: 0, y: 1 };
    }
    /**
     * A unit vector pointing downward (0, -1), since the world is Y-up. A
     * fresh vector is created on every access, so it's always safe to mutate.
     */
    static get down() {
        return { x: 0, y: -1 };
    }
    /**
     * A unit vector pointing left (-1, 0). A fresh vector is created on every
     * access, so it's always safe to mutate.
     */
    static get left() {
        return { x: -1, y: 0 };
    }
    /**
     * A unit vector pointing right (1, 0). A fresh vector is created on every
     * access, so it's always safe to mutate.
     */
    static get right() {
        return { x: 1, y: 0 };
    }
    /**
     * Adds another vector into `target`, mutating it in place.
     * @param target - The vector to mutate.
     * @param value - The vector to add.
     * @returns `target`, for chaining.
     */
    static add(target, value) {
        target.x += value.x;
        target.y += value.y;
        return target;
    }
    /**
     * Subtracts another vector from `target`, mutating it in place.
     * @param target - The vector to mutate.
     * @param value - The vector to subtract.
     * @returns `target`, for chaining.
     */
    static subtract(target, value) {
        target.x -= value.x;
        target.y -= value.y;
        return target;
    }
    /**
     * Multiplies `target` by a scalar value, mutating it in place.
     * @param target - The vector to mutate.
     * @param scalar - The scalar value to multiply by.
     * @returns `target`, for chaining.
     */
    static multiply(target, scalar) {
        target.x *= scalar;
        target.y *= scalar;
        return target;
    }
    /**
     * Multiplies `target`'s components by another vector's components, mutating it in place.
     * @param target - The vector to mutate.
     * @param value - The vector to multiply components with.
     * @returns `target`, for chaining.
     */
    static multiplyComponents(target, value) {
        target.x *= value.x;
        target.y *= value.y;
        return target;
    }
    /**
     * Divides `target` by a scalar value, mutating it in place.
     * @param target - The vector to mutate.
     * @param scalar - The scalar value to divide by.
     * @returns `target`, for chaining.
     */
    static divide(target, scalar) {
        target.x /= scalar;
        target.y /= scalar;
        return target;
    }
    /**
     * Calculates the squared magnitude of a vector.
     * This is faster than {@link Vec2.magnitude} as it avoids the square root.
     * @param vector - The vector.
     * @returns The squared magnitude of the vector.
     */
    static magnitudeSquared(vector) {
        return vector.x * vector.x + vector.y * vector.y;
    }
    /**
     * Calculates the magnitude (length) of a vector.
     * @param vector - The vector.
     * @returns The magnitude of the vector.
     */
    static magnitude(vector) {
        return Math.sqrt(Vec2.magnitudeSquared(vector));
    }
    /**
     * Normalizes `target` to unit length in the same direction, mutating it in place.
     * @param target - The vector to mutate.
     * @returns `target`, for chaining.
     * @throws An error if `target` has zero length, since its direction is undefined.
     */
    static normalize(target) {
        const length = Vec2.magnitude(target);
        if (length === 0) {
            throw new Error('Unable to normalize a zero-length Vector2.');
        }
        return Vec2.divide(target, length);
    }
    /**
     * Rounds `target`'s components down to the nearest integer, mutating it in place.
     * @param target - The vector to mutate.
     * @returns `target`, for chaining.
     */
    static floorComponents(target) {
        target.x = Math.floor(target.x);
        target.y = Math.floor(target.y);
        return target;
    }
    /**
     * Creates a deep copy of a vector.
     * @param vector - The vector to copy.
     * @returns A new Vector2 with the same component values.
     */
    static clone(vector) {
        return { x: vector.x, y: vector.y };
    }
    /**
     * Returns a string representation of a vector.
     * @param vector - The vector.
     * @returns A string in the format "(x, y)" with components rounded to 1 decimal place.
     */
    static toString(vector) {
        return `(${vector.x.toFixed(1)}, ${vector.y.toFixed(1)})`;
    }
    /**
     * Checks if two vectors are equal.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns True if the vectors have the same components, false otherwise.
     */
    static equals(a, b) {
        return a.x === b.x && a.y === b.y;
    }
    /**
     * Converts a vector to a glsl-compatible float32 array.
     * @param vector - The vector.
     * @returns The 2d vector array (e.g. `[5, 3]` for `{ x: 5, y: 3 }`).
     */
    static toFloat32Array(vector) {
        return new Float32Array([vector.x, vector.y]);
    }
    /**
     * Calculates the distance between two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns The distance between the two vectors.
     */
    static distanceTo(a, b) {
        return Math.hypot(b.x - a.x, b.y - a.y);
    }
    /**
     * Rotates `target` by a given angle in radians, mutating it in place.
     * @param target - The vector to mutate.
     * @param angleInRadians - The angle in radians to rotate the vector.
     * @returns `target`, for chaining.
     */
    static rotate(target, angleInRadians) {
        const cos = Math.cos(angleInRadians);
        const sin = Math.sin(angleInRadians);
        const { x, y } = target;
        target.x = x * cos - y * sin;
        target.y = x * sin + y * cos;
        return target;
    }
    /**
     * Calculates the dot product of two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns The dot product of the two vectors.
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    /**
     * Calculates the 2D (scalar) cross product of two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns The scalar cross product of the two vectors.
     */
    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    /**
     * Rotates `target` -90 degrees (y, -x) in place, making it perpendicular to
     * its original direction.
     * @param target - The vector to mutate.
     * @returns `target`, for chaining.
     */
    static perpendicular(target) {
        const { x, y } = target;
        target.x = y;
        target.y = -x;
        return target;
    }
    /**
     * Negates both of `target`'s components, mutating it in place.
     * @param target - The vector to mutate.
     * @returns `target`, for chaining.
     */
    static negate(target) {
        target.x = -target.x;
        target.y = -target.y;
        return target;
    }
}
