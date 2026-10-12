import { Vector2 } from '../../math/index.js';
import { EcsWorld } from '../../ecs/ecs-world.js';
/**
 * Options for {@link addScaleComponent}.
 */
export interface ScaleOptions {
    /**
     * The entity's scale relative to its parent, or to the world when it has
     * no parent. This is the value to write when resizing the entity.
     */
    local: Vector2;
}
/**
 * ECS-style component interface for scale.
 */
export interface ScaleEcsComponent extends ScaleOptions {
    /**
     * The entity's scale in world space. Output only:
     * `createTransformEcsSystem` writes it every frame from `local` and the
     * parent's world scale. It starts out equal to `local`.
     */
    world: Vector2;
}
export declare const scaleId: import("../../ecs/ecs-component.js").ComponentKey<ScaleEcsComponent>;
/**
 * Attaches a {@link ScaleEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the scale.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addScaleComponent(world: EcsWorld, entity: number, options?: Partial<ScaleOptions>): ScaleEcsComponent;
