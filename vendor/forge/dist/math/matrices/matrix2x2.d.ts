import { Vector2 } from '../vector2.js';
/**
 * A 2x2 matrix, primarily used to solve small effective-mass systems in
 * physics constraint solvers (e.g. a 2-DOF point constraint).
 *
 * Matrix layout:
 * [m00 m01]
 * [m10 m11]
 */
export declare class Matrix2x2 {
    readonly m00: number;
    readonly m01: number;
    readonly m10: number;
    readonly m11: number;
    constructor(m00: number, m01: number, m10: number, m11: number);
    /**
     * Solves `this * x = b` for `x`, using Cramer's rule.
     * @param b - The right-hand side vector.
     * @returns The solution vector, or `Vec2.zero` if the matrix is singular.
     */
    solve(b: Vector2): Vector2;
}
