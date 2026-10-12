import { Vector2 } from '../../math/index.js';
import { CircleCollider } from '../colliders/circle-collider.js';
import { Collider } from '../colliders/collider.js';
import { CollisionBody } from '../types/collision-body.js';
import { SweepHit } from '../types/sweep-hit.js';
/**
 * Finds every point at which a circle whose center moves in a straight line
 * from `start` to `end` (world space) first touches one feature (a face or
 * a vertex) of a target collider. Each feature contributes at most one hit.
 */
export type CircleSweepHitsFinder = (circle: CircleCollider, targetBody: CollisionBody, start: Vector2, end: Vector2) => SweepHit[];
/**
 * Finds where a moving circle first touches a circle-collider body.
 */
export declare const findCircleCircleSweepHits: CircleSweepHitsFinder;
/**
 * Finds where a moving circle first touches each face and corner of a
 * polygon-collider body.
 */
export declare const findCirclePolygonSweepHits: CircleSweepHitsFinder;
/**
 * Finds where a moving circle first touches each edge and corner of a
 * terrain-collider body's surface chain.
 *
 * Like narrow-phase collision, the sweep only meets the terrain's surface
 * (see {@link TerrainSurfaceEdge}), never the sides of the solid columns
 * beneath it. A circle rolling quickly along the ground would otherwise
 * catch on the top corner of every column it moves onto. Corners only
 * exist where the surface bends away from the circle; where it bends
 * toward the circle, the two edges' faces already meet.
 */
export declare const findCircleTerrainSweepHits: CircleSweepHitsFinder;
/**
 * The sweep-hit finder for a moving circle against each kind of collider.
 */
export declare const circleSweepHitFinders: Record<Collider['type'], CircleSweepHitsFinder>;
/**
 * Picks the hit the moving shape reaches first.
 * @param hits - The hits to choose from.
 * @returns The hit with the smallest `t`, or `null` if `hits` is empty.
 */
export declare function earliestSweepHit(hits: readonly SweepHit[]): SweepHit | null;
