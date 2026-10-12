import { EcsWorld } from '../../ecs/ecs-world.js';
/**
 * ECS-style component interface for speed.
 */
export interface SpeedEcsComponent {
    /** The speed value. No engine system reads it; game systems define its unit. */
    speed: number;
}
export declare const speedId: import("../../ecs/ecs-component.js").ComponentKey<SpeedEcsComponent>;
/**
 * Attaches a {@link SpeedEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the speed.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addSpeedComponent(world: EcsWorld, entity: number, options?: Partial<SpeedEcsComponent>): SpeedEcsComponent;
