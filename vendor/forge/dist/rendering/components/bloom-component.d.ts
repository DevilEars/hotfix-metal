import { EcsWorld } from '../../ecs/ecs-world.js';
/**
 * Configures the additive bloom post-process effect for whichever camera
 * entity this is attached to. See `createBloomEcsSystem`.
 */
export interface BloomEcsComponent {
    /**
     * The relative luminance (`0` to `1`) above which pixels start
     * contributing to the bloom glow. Pixels at or below this are excluded
     * entirely; the contribution fades in smoothly just above it (rather than
     * cutting off sharply) so bright shapes don't get a hard-edged halo.
     */
    threshold: number;
    /**
     * How many times to run the horizontal+vertical blur pair over the
     * bright pixels above `threshold` before adding them back onto the
     * scene. Works the same as `GaussianBlurEcsComponent.passes`: higher
     * values produce a wider, softer glow, and `0` turns bloom off.
     */
    passes: number;
    /**
     * How strongly the blurred bright pixels are added back onto the scene.
     * `0` disables bloom entirely; `1` adds them at their original
     * brightness. Unlike `GaussianBlurEcsComponent.intensity` this isn't a
     * blend factor and isn't clamped to `1`: values above `1` are valid and
     * produce a stronger glow.
     */
    intensity: number;
}
export declare const bloomId: import("../../ecs/ecs-component.js").ComponentKey<BloomEcsComponent>;
/**
 * Attaches a {@link BloomEcsComponent} to a camera entity, so
 * `createBloomEcsSystem` adds a glow around that camera's brightest pixels.
 * Has no effect if the entity's camera doesn't have a `renderTarget`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The camera entity to attach the bloom to.
 * @param options - Options for configuring the bloom.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addBloomComponent(world: EcsWorld, entity: number, options?: Partial<BloomEcsComponent>): BloomEcsComponent;
