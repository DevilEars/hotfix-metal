/**
 * A plain two-dimensional vector with x and y components.
 *
 * All mutating operations on {@link Vec2} mutate their `target` argument in
 * place and return it (for chaining) rather than allocating a new `Vector2`.
 * Callers that need to preserve the original value must clone it first with
 * {@link Vec2.clone}.
 */
export interface Vector2 {
    x: number;
    y: number;
}
/**
 * Static operations on {@link Vector2}. Mutating operations (`add`,
 * `subtract`, `multiply`, `multiplyComponents`, `divide`, `normalize`,
 * `floorComponents`, `rotate`, `perpendicular`, `negate`) mutate their
 * `target` argument in place and return it, rather than allocating a new
 * `Vector2`. Read-only operations (`magnitude`, `magnitudeSquared`, `dot`,
 * `cross`, `distanceTo`, `equals`, `toString`, `toFloat32Array`) and `clone`
 * never mutate their arguments.
 */
export declare class Vec2 {
    /**
     * A zero vector (0, 0). A fresh vector is created on every access, so it's
     * always safe to mutate.
     */
    static get zero(): Vector2;
    /**
     * A vector with components of 1 (1, 1). A fresh vector is created on every
     * access, so it's always safe to mutate.
     */
    static get one(): Vector2;
    /**
     * A unit vector pointing upward (0, 1), since the world is Y-up. A fresh
     * vector is created on every access, so it's always safe to mutate.
     */
    static get up(): Vector2;
    /**
     * A unit vector pointing downward (0, -1), since the world is Y-up. A
     * fresh vector is created on every access, so it's always safe to mutate.
     */
    static get down(): Vector2;
    /**
     * A unit vector pointing left (-1, 0). A fresh vector is created on every
     * access, so it's always safe to mutate.
     */
    static get left(): Vector2;
    /**
     * A unit vector pointing right (1, 0). A fresh vector is created on every
     * access, so it's always safe to mutate.
     */
    static get right(): Vector2;
    /**
     * Adds another vector into `target`, mutating it in place.
     * @param target - The vector to mutate.
     * @param value - The vector to add.
     * @returns `target`, for chaining.
     */
    static add(target: Vector2, value: Vector2): Vector2;
    /**
     * Subtracts another vector from `target`, mutating it in place.
     * @param target - The vector to mutate.
     * @param value - The vector to subtract.
     * @returns `target`, for chaining.
     */
    static subtract(target: Vector2, value: Vector2): Vector2;
    /**
     * Multiplies `target` by a scalar value, mutating it in place.
     * @param target - The vector to mutate.
     * @param scalar - The scalar value to multiply by.
     * @returns `target`, for chaining.
     */
    static multiply(target: Vector2, scalar: number): Vector2;
    /**
     * Multiplies `target`'s components by another vector's components, mutating it in place.
     * @param target - The vector to mutate.
     * @param value - The vector to multiply components with.
     * @returns `target`, for chaining.
     */
    static multiplyComponents(target: Vector2, value: Vector2): Vector2;
    /**
     * Divides `target` by a scalar value, mutating it in place.
     * @param target - The vector to mutate.
     * @param scalar - The scalar value to divide by.
     * @returns `target`, for chaining.
     */
    static divide(target: Vector2, scalar: number): Vector2;
    /**
     * Calculates the squared magnitude of a vector.
     * This is faster than {@link Vec2.magnitude} as it avoids the square root.
     * @param vector - The vector.
     * @returns The squared magnitude of the vector.
     */
    static magnitudeSquared(vector: Vector2): number;
    /**
     * Calculates the magnitude (length) of a vector.
     * @param vector - The vector.
     * @returns The magnitude of the vector.
     */
    static magnitude(vector: Vector2): number;
    /**
     * Normalizes `target` to unit length in the same direction, mutating it in place.
     * @param target - The vector to mutate.
     * @returns `target`, for chaining.
     * @throws An error if `target` has zero length, since its direction is undefined.
     */
    static normalize(target: Vector2): Vector2;
    /**
     * Rounds `target`'s components down to the nearest integer, mutating it in place.
     * @param target - The vector to mutate.
     * @returns `target`, for chaining.
     */
    static floorComponents(target: Vector2): Vector2;
    /**
     * Creates a deep copy of a vector.
     * @param vector - The vector to copy.
     * @returns A new Vector2 with the same component values.
     */
    static clone(vector: Vector2): Vector2;
    /**
     * Returns a string representation of a vector.
     * @param vector - The vector.
     * @returns A string in the format "(x, y)" with components rounded to 1 decimal place.
     */
    static toString(vector: Vector2): string;
    /**
     * Checks if two vectors are equal.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns True if the vectors have the same components, false otherwise.
     */
    static equals(a: Vector2, b: Vector2): boolean;
    /**
     * Converts a vector to a glsl-compatible float32 array.
     * @param vector - The vector.
     * @returns The 2d vector array (e.g. `[5, 3]` for `{ x: 5, y: 3 }`).
     */
    static toFloat32Array(vector: Vector2): Float32Array;
    /**
     * Calculates the distance between two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns The distance between the two vectors.
     */
    static distanceTo(a: Vector2, b: Vector2): number;
    /**
     * Rotates `target` by a given angle in radians, mutating it in place.
     * @param target - The vector to mutate.
     * @param angleInRadians - The angle in radians to rotate the vector.
     * @returns `target`, for chaining.
     */
    static rotate(target: Vector2, angleInRadians: number): Vector2;
    /**
     * Calculates the dot product of two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns The dot product of the two vectors.
     */
    static dot(a: Vector2, b: Vector2): number;
    /**
     * Calculates the 2D (scalar) cross product of two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns The scalar cross product of the two vectors.
     */
    static cross(a: Vector2, b: Vector2): number;
    /**
     * Rotates `target` -90 degrees (y, -x) in place, making it perpendicular to
     * its original direction.
     * @param target - The vector to mutate.
     * @returns `target`, for chaining.
     */
    static perpendicular(target: Vector2): Vector2;
    /**
     * Negates both of `target`'s components, mutating it in place.
     * @param target - The vector to mutate.
     * @returns `target`, for chaining.
     */
    static negate(target: Vector2): Vector2;
}
