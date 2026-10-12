import { Vector2 } from './vector2.js';
/**
 * A plain axis-aligned rectangle defined by its lower-left (`min`) and
 * upper-right (`max`) corners.
 */
export interface Rect {
    min: Vector2;
    max: Vector2;
}
/**
 * Static operations on {@link Rect}, mirroring the `Vector2`/`Vec2`
 * convention.
 */
export declare class Rects {
    /**
     * A zero-size rect at the origin. A fresh instance is created on every
     * access, so it's always safe to mutate.
     */
    static get zero(): Rect;
    /**
     * Calculates a rect's size.
     * @param rect - The rect.
     * @returns A new `Vector2` holding `max - min`.
     */
    static size(rect: Rect): Vector2;
    /**
     * Checks if a point is inside a rect, inclusive of its edges.
     * @param rect - The rect to check.
     * @param point - The point to check.
     * @returns True if the point is inside the rect, false otherwise.
     */
    static contains(rect: Rect, point: Vector2): boolean;
    /**
     * Checks if two rects overlap, inclusive of touching edges/corners.
     * @param a - The first rect.
     * @param b - The second rect.
     * @returns True if the rects overlap, false otherwise.
     */
    static intersects(a: Rect, b: Rect): boolean;
    /**
     * Creates a deep copy of a rect.
     * @param rect - The rect to copy.
     * @returns A new `Rect` with the same corner values.
     */
    static clone(rect: Rect): Rect;
}
