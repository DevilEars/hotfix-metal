import { AnimationFrame } from '../types/index.js';
import { SpriteSheet } from './create-sprite-sheet.js';
/**
 * Selects a contiguous run of frames from a sprite sheet, in row-major order, to build an animation clip.
 * @param spriteSheet - The sprite sheet to select frames from.
 * @param numberOfFrames - The total number of frames to include in the animation. This should not exceed the total frames available in the sprite sheet.
 * @param startFrame - The index of the first frame to include in the animation. Default is 0 (the first frame in the sprite sheet).
 * @returns The selected frames, to pass to the `AnimationClip` constructor.
 * @throws An error if the selection runs past the last row of the sprite sheet.
 */
export declare function selectAnimationFrames(spriteSheet: SpriteSheet, numberOfFrames: number, startFrame?: number): AnimationFrame[];
