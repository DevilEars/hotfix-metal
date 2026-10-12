import { Vec2 } from '../math/index.js';
import { Color } from './color.js';
import { withDefaults } from '../utilities/with-defaults.js';
/**
 * Default options for creating a `Sprite`.
 */
const defaultOptions = {
    pivot: { x: 0.5, y: 0.5 },
    tintColor: Color.white,
};
/**
 * The `Sprite` class represents a sprite in the rendering system.
 */
export class Sprite {
    /** The width of the sprite, including the bleed value. */
    width;
    /** The height of the sprite, including the bleed value. */
    height;
    /** The pivot point of the sprite. */
    pivot;
    /** The tint color of the sprite. */
    tintColor;
    /** The texture the sprite draws. */
    texture;
    /**
     * Constructs a new instance of the `Sprite` class.
     * @param options - The options for creating the sprite.
     */
    constructor(options) {
        const { texture, pivot, width, height, tintColor } = withDefaults(defaultOptions, options);
        this.pivot = Vec2.clone(pivot);
        this.tintColor = tintColor;
        this.width = width;
        this.height = height;
        this.texture = texture;
    }
}
