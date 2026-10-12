import { Vector2 } from '../../math/index.js';
import { RaycastShapeHit } from '../types/raycast-hit.js';
/**
 * Casts a ray segment against a convex polygon's world-space edges, keeping
 * the intersection closest to `start`. Used for both {@link PolygonCollider}
 * and each of a {@link TerrainCollider}'s segments, which share the same
 * vertices/normals shape.
 * @param vertices - The polygon's world-space vertices, in order.
 * @param normals - The polygon's world-space outward-facing edge normals,
 * one per edge between consecutive `vertices`.
 * @param start - The ray's world-space start point.
 * @param end - The ray's world-space end point.
 * @returns The closest intersection to `start`, or `null` if the segment
 * from `start` to `end` doesn't cross any edge.
 */
export declare function raycastConvexPolygon(vertices: readonly Vector2[], normals: readonly Vector2[], start: Vector2, end: Vector2): RaycastShapeHit | null;
