import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const bloomId = createComponentId('bloom');
const defaultBloomOptions = {
    threshold: 0.8,
    passes: 4,
    intensity: 1,
};
/**
 * Attaches a {@link BloomEcsComponent} to a camera entity, so
 * `createBloomEcsSystem` adds a glow around that camera's brightest pixels.
 * Has no effect if the entity's camera doesn't have a `renderTarget`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The camera entity to attach the bloom to.
 * @param options - Options for configuring the bloom.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addBloomComponent(world, entity, options = {}) {
    const component = withDefaults(defaultBloomOptions, options);
    return world.addComponent(entity, bloomId, component);
}
