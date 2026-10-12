import { CollisionBody } from '../types/collision-body.js';
import { NarrowPhaseManifold } from '../types/collision-manifold.js';
/**
 * Detects the collisions between a circle-collider body and a
 * terrain-collider body, against the terrain's surface chain (see
 * {@link TerrainSurfaceEdge}). The terrain's solid slab is never tested, so
 * a contact normal always comes from the ground's actual surface and never
 * from an interior boundary between two neighboring surface edges.
 *
 * A circle deep enough under the terrain to have passed out of the bottom
 * of its slab is treated as having fallen through, exactly as it would have
 * with a closed slab, rather than being dragged all the way back up to the
 * surface.
 * @param circleBody - The body with a {@link CircleCollider}.
 * @param terrainBody - The body with a {@link TerrainCollider}.
 * @returns One manifold per surface feature the circle touches (entity ids
 * not yet populated, normals pointing from `circleBody` toward
 * `terrainBody`), ordered left to right along the terrain, or an empty
 * array if the shapes don't overlap.
 */
export declare function detectCircleTerrainCollision(circleBody: CollisionBody, terrainBody: CollisionBody): NarrowPhaseManifold[];
