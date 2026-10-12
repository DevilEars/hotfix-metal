import { Vector2 } from '../../math/index.js';
import { CollisionBody } from '../types/collision-body.js';
import { RaycastShapeHit } from '../types/raycast-hit.js';
/**
 * Casts a ray segment against a terrain-collider body, by running the same
 * ray-vs-convex-polygon test used for {@link raycastPolygon} against the
 * solid slab column beneath each of the terrain's surface edges that
 * overlaps the ray's local x-range, keeping the intersection closest to
 * `start`.
 *
 * Unlike narrow-phase collision - which only ever meets the terrain's
 * surface, so a moving body can't catch on a boundary between two
 * neighboring columns (see {@link TerrainSurfaceEdge}) - a ray can
 * legitimately enter the slab from any direction, including from
 * underneath, so it is tested against the whole solid.
 * @param terrainBody - The body with a {@link TerrainCollider}.
 * @param start - The ray's world-space start point.
 * @param end - The ray's world-space end point.
 * @returns The intersection closest to `start`, or `null` if the segment
 * from `start` to `end` doesn't cross the terrain.
 */
export declare function raycastTerrain(terrainBody: CollisionBody, start: Vector2, end: Vector2): RaycastShapeHit | null;
