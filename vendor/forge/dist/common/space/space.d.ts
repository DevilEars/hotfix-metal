import { ForgeEvent } from '../../events/index.js';
import { Vector2 } from '../../math/index.js';
/**
 * Class to represent a 2D space with width, height, and center point.
 */
export declare class Space {
    /**
     * Event that is raised when the space changes.
     */
    onSpaceChange: ForgeEvent;
    private _center;
    private _width;
    private _height;
    /**
     * Creates an instance of Space.
     * @param width - The width of the space.
     * @param height - The height of the space.
     * @example
     * const space = new Space(800, 600);
     * console.log(space.width); // 800
     * console.log(space.height); // 600
     * console.log(space.center); // { x: 400, y: 300 }
     */
    constructor(width: number, height: number);
    /**
     * Gets the center point of the space.
     * @returns The center point of the space.
     */
    get center(): Vector2;
    /**
     * Gets the width of the space.
     * @returns The width of the space.
     */
    get width(): number;
    /**
     * Gets the height of the space.
     * @returns The height of the space.
     */
    get height(): number;
    /**
     * Sets the dimensions of the space.
     * Recalculates the center and raises `onSpaceChange`.
     * @param width - The new width of the space.
     * @param height - The new height of the space.
     * @returns The updated Space instance.
     */
    setValue(width: number, height: number): this;
    /**
     * Calculates the center point of the space based on its dimensions.
     */
    private _calculateCenter;
}
