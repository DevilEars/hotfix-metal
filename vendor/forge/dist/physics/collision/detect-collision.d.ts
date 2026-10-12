import { CollisionBody } from '../types/collision-body.js';
import { NarrowPhaseManifold } from '../types/collision-manifold.js';
/**
 * Detects the collisions between two {@link CollisionBody} instances,
 * dispatching to the appropriate narrow-phase detector based on each
 * body's collider type.
 *
 * Two convex shapes have at most one manifold between them, but a
 * {@link TerrainCollider}'s surface is a chain rather than a single convex
 * shape, so a body wide enough to straddle several of its surface edges
 * gets one manifold per edge it touches.
 * @param bodyA - The first body.
 * @param bodyB - The second body.
 * @returns One manifold per contacting feature pair (entity ids not yet
 * populated, normals pointing from `bodyA` toward `bodyB`), or an empty
 * array if the bodies don't overlap.
 * @throws An error if no detector is registered for the bodies' collider
 * pair.
 */
export declare function detectCollision(bodyA: CollisionBody, bodyB: CollisionBody): NarrowPhaseManifold[];
