import { Vector2 } from '../math/index.js';
import { Color } from './color.js';
import type { Texture } from './texture.js';
/**
 * Options for creating a `Sprite`.
 */
export type SpriteOptions = {
    /** The texture the sprite draws. */
    texture: Texture;
    /** The width of the sprite. */
    width: number;
    /** The height of the sprite. */
    height: number;
    /** The pivot point of the sprite (optional). */
    pivot?: Vector2;
    /** The tint color of the sprite (optional). */
    tintColor?: Color;
};
/**
 * The `Sprite` class represents a sprite in the rendering system.
 */
export declare class Sprite {
    /** The width of the sprite, including the bleed value. */
    width: number;
    /** The height of the sprite, including the bleed value. */
    height: number;
    /** The pivot point of the sprite. */
    pivot: Vector2;
    /** The tint color of the sprite. */
    tintColor: Color;
    /** The texture the sprite draws. */
    texture: Texture;
    /**
     * Constructs a new instance of the `Sprite` class.
     * @param options - The options for creating the sprite.
     */
    constructor(options: SpriteOptions);
}
