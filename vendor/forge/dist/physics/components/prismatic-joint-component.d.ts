import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/index.js';
/**
 * Fields of {@link PrismaticJointEcsComponent} with a sensible default;
 * callers may omit these.
 */
export interface PrismaticJointDefaultedOptions {
    /** Anchor point, in `entityA`'s local space, `entityB`'s anchor slides relative to. Defaults to `entityA`'s origin. */
    localAnchorA: Vector2;
    /** Anchor point, in `entityB`'s local space, that slides along the axis. Defaults to `entityB`'s origin. */
    localAnchorB: Vector2;
    /** The axis `entityB`'s anchor is free to slide along, in `entityA`'s local space. Normalized on add. Defaults to `+X`. */
    axis: Vector2;
    /** Whether the translation along `axis` (from `entityA`'s anchor to `entityB`'s) is clamped to `[lowerTranslation, upperTranslation]`. Defaults to `false`. */
    enableLimit: boolean;
    /** The lowest translation along `axis` allowed when `enableLimit` is `true`. Defaults to `0`. */
    lowerTranslation: number;
    /** The highest translation along `axis` allowed when `enableLimit` is `true`. Defaults to `0`. */
    upperTranslation: number;
    /** The soft constraint's target frequency, in Hz, correcting perpendicular/angular drift. Defaults to `60`. */
    hertz: number;
    /** The soft constraint's damping ratio correcting perpendicular/angular drift. Defaults to `2`. */
    dampingRatio: number;
}
export interface PrismaticJointRequiredOptions {
    /** The entity `axis` and the translation are measured relative to. */
    entityA: number;
    /** The entity that slides along `axis` relative to `entityA`. */
    entityB: number;
}
/**
 * ECS-style component interface for a prismatic (slider) joint, constraining
 * `entityB` to slide relative to `entityA` only along `axis`, with `entityB`'s
 * rotation locked relative to `entityA`'s. An entity referenced by
 * `entityA`/`entityB` with no `RigidBodyEcsComponent` is treated as static.
 */
export interface PrismaticJointEcsComponent extends PrismaticJointRequiredOptions, PrismaticJointDefaultedOptions {
    /** `entityB`'s rotation minus `entityA`'s rotation at the moment the joint was created; the locked relative rotation. */
    readonly referenceAngle: number;
    /** Warm-start state: the accumulated impulse of the perpendicular-translation constraint. */
    accumulatedPerpImpulse: number;
    /** Warm-start state: the accumulated impulse of the angular-lock constraint. */
    accumulatedAngularImpulse: number;
    /** Warm-start state: the accumulated impulse of the translation-limit constraint. */
    accumulatedLimitImpulse: number;
}
export declare const prismaticJointId: import("../../ecs/ecs-component.js").ComponentKey<PrismaticJointEcsComponent>;
/**
 * Attaches a {@link PrismaticJointEcsComponent} to `entity`, constraining
 * `options.entityB` to slide relative to `options.entityA` along `axis`.
 * `entity` is a dedicated joint entity, not `entityA` or `entityB`
 * themselves. `entityA`/`entityB` must already have a `RotationEcsComponent`
 * (used to compute `referenceAngle`).
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The (dedicated) entity to attach the joint component to.
 * @param options - Options for configuring the joint.
 * @returns The attached component, for further tuning or runtime changes.
 * @throws An error if `axis` is the zero vector, `lowerTranslation` is
 * greater than `upperTranslation`, or `entityA` or `entityB` has no
 * `RotationEcsComponent`.
 */
export declare function addPrismaticJointComponent(world: EcsWorld, entity: number, options: PrismaticJointRequiredOptions & Partial<PrismaticJointDefaultedOptions>): PrismaticJointEcsComponent;
