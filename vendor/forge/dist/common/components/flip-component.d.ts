import { EcsWorld } from '../../ecs/ecs-world.js';
/**
 * ECS-style component interface for flipping sprites.
 */
export interface FlipEcsComponent {
    /** Whether the sprite is mirrored horizontally. */
    flipX: boolean;
    /** Whether the sprite is mirrored vertically. */
    flipY: boolean;
}
export declare const flipId: import("../../ecs/ecs-component.js").ComponentKey<FlipEcsComponent>;
/**
 * Attaches a {@link FlipEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the flip.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addFlipComponent(world: EcsWorld, entity: number, options?: Partial<FlipEcsComponent>): FlipEcsComponent;
