import { Vec2 } from '../../math/index.js';
import { AnimationClip } from '../types/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * Generates animation frames based on the provided parameters.
 * @param numberOfFrames - The total number of frames in the animation.
 * @param spritesPerRow - The number of sprites in each row of the sprite sheet.
 * @param startPositionPercentage - The starting position of the animation frames in the sprite sheet, as a percentage.
 * @param spriteUVSize - The size of each sprite in the sprite sheet, as a percentage.
 * @returns An array of generated animation frames.
 */
function generateAnimationFrames(numberOfFrames, spritesPerRow, startPositionPercentage, spriteUVSize) {
    const animationFrames = [];
    for (let i = 0; i < numberOfFrames; i++) {
        const row = Math.floor(i / spritesPerRow);
        const col = i % spritesPerRow;
        animationFrames.push({
            offset: {
                x: startPositionPercentage.x + col * spriteUVSize.x,
                y: startPositionPercentage.y + row * spriteUVSize.y,
            },
            dimensions: spriteUVSize,
        });
    }
    return animationFrames;
}
const defaultCreateAnimationSetParams = {
    startPositionPercentage: Vec2.zero,
    endPositionPercentage: Vec2.one,
};
/**
 * @param spritesPerColumn - The number of sprites in each column of the sprite sheet.
 * @param spritesPerRow - The number of sprites in each row of the sprite sheet.
 * @param options - Optional parameters for creating the animation set.
 * @returns An Animation object containing the generated animation frames.
 */
export function createAnimation(spritesPerColumn, spritesPerRow, options) {
    const { startPositionPercentage, endPositionPercentage } = withDefaults(defaultCreateAnimationSetParams, options);
    const numFrames = spritesPerColumn * spritesPerRow;
    const spriteUVSize = {
        x: (endPositionPercentage.x - startPositionPercentage.x) / spritesPerRow,
        y: (endPositionPercentage.y - startPositionPercentage.y) / spritesPerColumn,
    };
    const animationFrames = generateAnimationFrames(numFrames, spritesPerRow, startPositionPercentage, spriteUVSize);
    const animation = new AnimationClip(animationFrames);
    return animation;
}
