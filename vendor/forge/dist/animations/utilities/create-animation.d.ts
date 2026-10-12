import { Vector2 } from '../../math/index.js';
import { AnimationClip } from '../types/index.js';
/**
 * Optional parameters for creating an animation.
 */
export interface AnimationCreationOptions {
    /**
     * The starting position of the animation frames in the sprite sheet, as a percentage.
     * @default (0, 0).
     */
    startPositionPercentage: Vector2;
    /**
     * The ending position of the animation frames in the sprite sheet, as a percentage.
     * @default (1, 1).
     */
    endPositionPercentage: Vector2;
}
/**
 * @param spritesPerColumn - The number of sprites in each column of the sprite sheet.
 * @param spritesPerRow - The number of sprites in each row of the sprite sheet.
 * @param options - Optional parameters for creating the animation set.
 * @returns An Animation object containing the generated animation frames.
 */
export declare function createAnimation(spritesPerColumn: number, spritesPerRow: number, options?: Partial<AnimationCreationOptions>): AnimationClip;
