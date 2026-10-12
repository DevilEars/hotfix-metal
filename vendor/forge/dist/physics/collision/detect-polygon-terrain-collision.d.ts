import { CollisionBody } from '../types/collision-body.js';
import { NarrowPhaseManifold } from '../types/collision-manifold.js';
/**
 * Detects the collisions between a polygon-collider body and a
 * terrain-collider body, by running the same reference/incident face
 * clipping used for {@link detectPolygonPolygonCollision} against every
 * edge of the terrain's surface chain (see {@link TerrainSurfaceEdge}) the
 * polygon's local x-range overlaps.
 *
 * Every edge the polygon genuinely straddles contributes its own manifold,
 * rather than all of them competing for one "deepest" slot. That is what
 * makes a wide body's contact stable: an edge's manifold appears when the
 * polygon reaches that edge and disappears when it leaves, its feature ids
 * stay in a range of that edge's own, and no amount of floating-point noise
 * between two near-coplanar edges can make the pair of them trade places
 * from one tick to the next and lose their warm-started impulses.
 *
 * The terrain's solid slab is never tested, only its surface, so a contact
 * normal can never come from an interior boundary between two neighboring
 * edges, and one that would nonetheless push the polygon along the ground
 * it was found on is resolved against that ground instead (see
 * {@link contactAgainstEdge}).
 * @param polygonBody - The body with a {@link PolygonCollider}.
 * @param terrainBody - The body with a {@link TerrainCollider}.
 * @returns One manifold per surface edge the polygon touches (entity ids
 * not yet populated, normals pointing from `polygonBody` toward
 * `terrainBody`), ordered left to right along the terrain, or an empty
 * array if the shapes don't overlap.
 */
export declare function detectPolygonTerrainCollision(polygonBody: CollisionBody, terrainBody: CollisionBody): NarrowPhaseManifold[];
