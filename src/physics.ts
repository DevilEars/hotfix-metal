import { PolygonCollider } from '@forge-game-engine/forge/physics';
import { Platform } from './level';

/** Axis-aligned box collider, origin at the bottom centre of the entity. */
export const boxCollider = (width: number, height: number, yOffset = 0): PolygonCollider =>
  new PolygonCollider([
    { x: -width / 2, y: yOffset },
    { x: width / 2, y: yOffset },
    { x: width / 2, y: yOffset + height },
    { x: -width / 2, y: yOffset + height },
  ]);

/**
 * Finds the surface a falling body lands on this step, or `null` if it keeps
 * falling. The ground (y = 0) is solid everywhere; platforms are one-way, so
 * you can jump up through them and land on top.
 */
export function findLanding(
  platforms: readonly Platform[],
  x: number,
  halfWidth: number,
  previousY: number,
  newY: number,
): number | null {
  let best: number | null = null;

  if (newY <= 0) {
    best = 0;
  }

  for (const platform of platforms) {
    if (
      x + halfWidth > platform.x &&
      x - halfWidth < platform.x + platform.width &&
      previousY >= platform.y - 0.05 &&
      newY <= platform.y &&
      (best === null || platform.y > best)
    ) {
      best = platform.y;
    }
  }

  return best;
}
