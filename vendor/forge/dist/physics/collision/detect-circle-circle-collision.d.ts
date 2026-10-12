import { CollisionBody } from '../types/collision-body.js';
import { CollisionManifold } from '../types/collision-manifold.js';
/**
 * Detects a collision between two circle-collider bodies.
 * @param bodyA - The first body, with a {@link CircleCollider}.
 * @param bodyB - The second body, with a {@link CircleCollider}.
 * @returns A collision manifold (entity ids not yet populated) if the
 * circles overlap, otherwise `null`.
 */
export declare function detectCircleCircleCollision(bodyA: CollisionBody, bodyB: CollisionBody): Omit<CollisionManifold, 'entityA' | 'entityB'> | null;
