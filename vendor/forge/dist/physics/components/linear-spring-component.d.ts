import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/index.js';
/**
 * Fields of {@link LinearSpringEcsComponent} with a sensible default;
 * callers may omit these.
 */
export interface LinearSpringDefaultedOptions {
    /** Anchor point, in `entityA`'s local space. Defaults to its origin. */
    localAnchorA: Vector2;
    /** Anchor point, in `entityB`'s local space. Defaults to its origin. */
    localAnchorB: Vector2;
    /**
     * The distance between the two anchors at which the spring applies no
     * force. Defaults to the distance between the anchors at the moment the
     * spring is added.
     */
    restLength: number;
}
export interface LinearSpringRequiredOptions {
    /** The first connected entity. */
    entityA: number;
    /** The second connected entity. */
    entityB: number;
    /** The spring's stiffness (Hooke's law constant), in newtons/unit. */
    stiffness: number;
}
/**
 * ECS-style component interface for a Hooke's-law linear spring pulling (or
 * pushing) two entities' anchor points toward `restLength` apart. A pure
 * force generator, not a hard constraint - pair with a joint (e.g. a
 * `PrismaticJointEcsComponent`) if the anchors must also be geometrically
 * constrained. An entity referenced by `entityA`/`entityB` with no
 * `RigidBodyEcsComponent` is treated as static.
 */
export interface LinearSpringEcsComponent extends LinearSpringRequiredOptions, LinearSpringDefaultedOptions {
}
export declare const linearSpringId: import("../../ecs/ecs-component.js").ComponentKey<LinearSpringEcsComponent>;
/**
 * Attaches a {@link LinearSpringEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The (dedicated) entity to attach the spring component to.
 * @param options - Options for configuring the spring.
 * @returns The attached component, for further tuning or runtime changes.
 * @throws An error if `stiffness` is negative, or if `restLength` is
 * omitted and `entityA` or `entityB` has no `PositionEcsComponent` or
 * `RotationEcsComponent` to measure it from.
 */
export declare function addLinearSpringComponent(world: EcsWorld, entity: number, options: LinearSpringRequiredOptions & Partial<LinearSpringDefaultedOptions>): LinearSpringEcsComponent;
