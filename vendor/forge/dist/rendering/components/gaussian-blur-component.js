import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const gaussianBlurId = createComponentId('gaussianBlur');
const defaultGaussianBlurOptions = {
    passes: 4,
    intensity: 1,
};
/**
 * Attaches a {@link GaussianBlurEcsComponent} to a camera entity, so
 * `createGaussianBlurEcsSystem` blurs that camera's `renderTarget`. Has no
 * effect if the entity's camera doesn't have a `renderTarget`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The camera entity to attach the blur to.
 * @param options - Options for configuring the blur.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addGaussianBlurComponent(world, entity, options = {}) {
    const component = withDefaults(defaultGaussianBlurOptions, options);
    return world.addComponent(entity, gaussianBlurId, component);
}
