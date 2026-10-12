import { earliestSweepHit, findCirclePolygonSweepHits, } from './circle-sweep-hits.js';
/**
 * Sweeps a circle whose center moves in a straight line from `start` to
 * `end` against a polygon-collider body, finding the first point at which they
 * touch.
 *
 * A sweep that starts with the circle already touching a feature of the
 * target ignores that feature: there is no time of impact to find, and
 * narrow-phase collision already handles every contact that exists.
 * @param circle - The moving circle's collider, for its radius.
 * @param targetBody - The body to sweep against, in its world pose.
 * @param start - The circle's world center at the start of the sweep (see
 * `CircleCollider.getWorldCenter`).
 * @param end - The circle's world center at the end of the sweep.
 * @returns The first contact, or `null` if the circle doesn't touch the
 * target on the way from `start` to `end`.
 */
export function sweepCirclePolygon(circle, targetBody, start, end) {
    return earliestSweepHit(findCirclePolygonSweepHits(circle, targetBody, start, end));
}
