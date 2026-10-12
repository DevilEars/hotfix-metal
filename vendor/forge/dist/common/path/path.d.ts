import { Vector2 } from '../../math/index.js';
type MapPathCallback<T> = (point: Vector2, index: number, path: Vector2[]) => T;
/**
 * Class to represent a path consisting of a series of 2D points.
 */
export declare class Path implements Iterable<Vector2> {
    path: Vector2[];
    /**
     * Creates an instance of Path.
     * @param path - An array of Vector2 points representing the path.
     * @example
     * const path = new Path([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
     * console.log(path.length); // 2
     */
    constructor(path?: Vector2[]);
    /**
     * Gets the point at the specified index.
     * @param index - The index of the point to retrieve.
     * @returns The point at the specified index.
     */
    at(index: number): Vector2;
    /**
     * Adds a point to the end of the path.
     * @param point - The point to add.
     */
    push(point: Vector2): void;
    /**
     * Maps the path to a new array using the provided callback function.
     * @param callback - The callback function to apply to each point.
     * @returns A new array with the results of calling the callback on each point.
     * @example
     * const pointStrings = path.map(point => `[${point.x},${point.y}]`);
     * console.log(pointStrings); // ['[0,0]', '[1,1]']
     */
    map<T>(callback: MapPathCallback<T>): T[];
    /**
     * Gets the first point in the path.
     * @returns The first point in the path.
     */
    get first(): Vector2;
    /**
     * Gets the last point in the path.
     * @returns The last point in the path.
     */
    get last(): Vector2 | null;
    /**
     * Gets the number of points in the path.
     * @returns The number of points in the path.
     */
    get length(): number;
    /**
     * Returns an iterator for the path.
     * @returns An iterator for the path.
     * @example
     * for (const point of path) {
     *   console.log(point);
     * }
     */
    [Symbol.iterator](): Iterator<Vector2>;
}
export {};
