import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/index.js';
/**
 * Fields of {@link RevoluteJointEcsComponent} with a sensible default;
 * callers may omit these.
 */
export interface RevoluteJointDefaultedOptions {
    /** Anchor point, in `entityA`'s local space, the joint pins to `entityB`'s anchor. Defaults to `entityA`'s origin. */
    localAnchorA: Vector2;
    /** Anchor point, in `entityB`'s local space, the joint pins to `entityA`'s anchor. Defaults to `entityB`'s origin. */
    localAnchorB: Vector2;
    /** Whether the relative angle between `entityA` and `entityB`, measured from `referenceAngle`, is clamped to `[lowerAngle, upperAngle]`. Defaults to `false`. */
    enableLimit: boolean;
    /** The lowest relative angle (radians) allowed when `enableLimit` is `true`. Defaults to `0`. */
    lowerAngle: number;
    /** The highest relative angle (radians) allowed when `enableLimit` is `true`. Defaults to `0`. */
    upperAngle: number;
    /** The soft constraint's target frequency, in Hz, correcting anchor drift. Defaults to `60`. */
    hertz: number;
    /** The soft constraint's damping ratio correcting anchor drift. Defaults to `2`. */
    dampingRatio: number;
}
export interface RevoluteJointRequiredOptions {
    /** The first pinned entity. */
    entityA: number;
    /** The second pinned entity. */
    entityB: number;
}
/**
 * ECS-style component interface for a revolute (hinge) joint, pinning two
 * entities together at a shared anchor point while leaving their relative
 * rotation free (or optionally clamped between `lowerAngle`/`upperAngle`).
 * An entity referenced by `entityA`/`entityB` with no `RigidBodyEcsComponent`
 * is treated as static.
 */
export interface RevoluteJointEcsComponent extends RevoluteJointRequiredOptions, RevoluteJointDefaultedOptions {
    /** `entityB`'s rotation minus `entityA`'s rotation at the moment the joint was created; the zero point for the angle limit. */
    readonly referenceAngle: number;
    /** Warm-start state: the accumulated impulse of the 2-DOF point constraint. */
    accumulatedPointImpulse: Vector2;
}
export declare const revoluteJointId: import("../../ecs/ecs-component.js").ComponentKey<RevoluteJointEcsComponent>;
/**
 * Attaches a {@link RevoluteJointEcsComponent} to `entity`, pinning
 * `options.entityA` and `options.entityB` together at a shared anchor.
 * `entity` is a dedicated joint entity, not `entityA` or `entityB`
 * themselves. `entityA`/`entityB` must already have a `RotationEcsComponent`
 * (used to compute `referenceAngle`).
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The (dedicated) entity to attach the joint component to.
 * @param options - Options for configuring the joint.
 * @returns The attached component, for further tuning or runtime changes.
 * @throws An error if `lowerAngle` is greater than `upperAngle`, or
 * `entityA` or `entityB` has no `RotationEcsComponent`.
 */
export declare function addRevoluteJointComponent(world: EcsWorld, entity: number, options: RevoluteJointRequiredOptions & Partial<RevoluteJointDefaultedOptions>): RevoluteJointEcsComponent;
