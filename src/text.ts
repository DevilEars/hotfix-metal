import { Color } from '@forge-game-engine/forge/rendering';
import { PIXELS_PER_UNIT } from './constants';

/** The Kenney pixel fonts are drawn on an 8 px em. */
const FONT_EM_PIXELS = 8;

/**
 * Text size (em height in world units) at which one font pixel covers
 * `scale` game pixels, so lettering sits on the same grid as the sprites.
 */
export const textSize = (scale = 1): number => (scale * FONT_EM_PIXELS) / PIXELS_PER_UNIT;

/** Dark ink for hard drop shadows under pixel text. */
export const TEXT_SHADOW = new Color(0.04, 0.02, 0.1, 1);

/** Hard (unblurred) drop shadow, in screen pixels. */
export const hardShadow = {
  shadowColor: TEXT_SHADOW,
  shadowOffset: { x: 2, y: -2 },
  shadowSoftness: 0,
};
