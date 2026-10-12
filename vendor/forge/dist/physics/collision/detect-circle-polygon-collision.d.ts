import { CollisionBody } from '../types/collision-body.js';
import { CollisionManifold } from '../types/collision-manifold.js';
/**
 * Detects a collision between a circle-collider body and a
 * polygon-collider body.
 * @param circleBody - The body with a {@link CircleCollider}.
 * @param polygonBody - The body with a {@link PolygonCollider}.
 * @returns A collision manifold (entity ids not yet populated, normal
 * pointing from `circleBody` toward `polygonBody`) if the shapes overlap,
 * otherwise `null`.
 */
export declare function detectCirclePolygonCollision(circleBody: CollisionBody, polygonBody: CollisionBody): Omit<CollisionManifold, 'entityA' | 'entityB'> | null;
