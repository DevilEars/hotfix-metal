import { Vector2 } from '../../math/index.js';
import { CollisionBody } from '../types/collision-body.js';
import { RaycastShapeHit } from '../types/raycast-hit.js';
/**
 * Casts a ray segment against a circle-collider body.
 * @param circleBody - The body with a {@link CircleCollider}.
 * @param start - The ray's world-space start point.
 * @param end - The ray's world-space end point.
 * @returns The intersection closest to `start`, or `null` if the segment
 * from `start` to `end` doesn't cross the circle.
 */
export declare function raycastCircle(circleBody: CollisionBody, start: Vector2, end: Vector2): RaycastShapeHit | null;
