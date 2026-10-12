import { EcsWorld } from '../ecs/ecs-world.js';
import { Vector2 } from '../math/index.js';
/**
 * Applies `impulse` at the world-space `point` to `entity`'s rigid body,
 * changing its velocity and, unless `point` is the body's center of mass,
 * its angular velocity. A no-op unless the entity's
 * `RigidBodyEcsComponent.type` (see {@link RigidBodyType}) is `'dynamic'`,
 * since `'static'`/`'kinematic'` bodies aren't affected by impulses.
 *
 * The body's center of mass (its collider's centroid, see
 * `getRigidBodyMassData`) is found from the entity's current world
 * transform, so to push a body without spinning it, apply the impulse at
 * its center of mass rather than at its position.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity whose rigid body to apply the impulse to.
 * @param impulse - The impulse to apply.
 * @param point - The world-space point `impulse` is applied at.
 * @throws An error if `entity` has a `'dynamic'` rigid body but no
 * `PositionEcsComponent`, or no `ColliderEcsComponent` to take its mass
 * from.
 */
export declare function applyImpulse(world: EcsWorld, entity: number, impulse: Vector2, point: Vector2): void;
