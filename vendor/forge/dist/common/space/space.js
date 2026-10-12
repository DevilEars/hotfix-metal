import { ForgeEvent } from '../../events/index.js';
/**
 * Class to represent a 2D space with width, height, and center point.
 */
export class Space {
    /**
     * Event that is raised when the space changes.
     */
    onSpaceChange;
    _center;
    _width;
    _height;
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
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._center = { x: this._width / 2, y: this._height / 2 };
        this.onSpaceChange = new ForgeEvent('space-change');
    }
    /**
     * Gets the center point of the space.
     * @returns The center point of the space.
     */
    get center() {
        return this._center;
    }
    /**
     * Gets the width of the space.
     * @returns The width of the space.
     */
    get width() {
        return this._width;
    }
    /**
     * Gets the height of the space.
     * @returns The height of the space.
     */
    get height() {
        return this._height;
    }
    /**
     * Sets the dimensions of the space.
     * Recalculates the center and raises `onSpaceChange`.
     * @param width - The new width of the space.
     * @param height - The new height of the space.
     * @returns The updated Space instance.
     */
    setValue(width, height) {
        this._width = width;
        this._height = height;
        this._calculateCenter();
        this.onSpaceChange.raise();
        return this;
    }
    /**
     * Calculates the center point of the space based on its dimensions.
     */
    _calculateCenter() {
        this._center = { x: this._width / 2, y: this._height / 2 };
    }
}
