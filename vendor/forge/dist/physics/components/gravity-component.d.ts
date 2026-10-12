import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/vector2.js';
/**
 * Fields of {@link GravityEcsComponent} with a sensible default; callers
 * may omit these.
 */
export interface GravityDefaultedOptions {
    /**
     * The acceleration, in world units per second squared, that
     * `createGravityEcsSystem` adds to the entity's
     * `RigidBodyEcsComponent.velocity` every tick, scaled by the tick's
     * duration. Defaults to `(0, -9.81)`.
     */
    amount: Vector2;
}
/**
 * ECS-style component interface for gravity acting on one entity's
 * `'dynamic'` rigid body.
 */
export type GravityEcsComponent = GravityDefaultedOptions;
export declare const gravityId: import("../../ecs/ecs-component.js").ComponentKey<GravityDefaultedOptions>;
/**
 * Attaches a {@link GravityEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the gravity.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addGravityComponent(world: EcsWorld, entity: number, options?: Partial<GravityEcsComponent>): GravityEcsComponent;
