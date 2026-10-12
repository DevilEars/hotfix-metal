import { CollisionBody } from '../types/collision-body.js';
import { CollisionManifold } from '../types/collision-manifold.js';
/**
 * Detects a collision between two polygon-collider bodies, using the
 * separating axis theorem with reference/incident face clipping.
 * @param bodyA - The first body, with a {@link PolygonCollider}.
 * @param bodyB - The second body, with a {@link PolygonCollider}.
 * @returns A collision manifold (entity ids not yet populated, normal
 * pointing from `bodyA` toward `bodyB`) if the polygons overlap, otherwise
 * `null`.
 */
export declare function detectPolygonPolygonCollision(bodyA: CollisionBody, bodyB: CollisionBody): Omit<CollisionManifold, 'entityA' | 'entityB'> | null;
