import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const flipId = createComponentId('flip');
const defaultFlipOptions = {
    flipX: false,
    flipY: false,
};
/**
 * Attaches a {@link FlipEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the flip.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addFlipComponent(world, entity, options = {}) {
    const component = withDefaults(defaultFlipOptions, options);
    return world.addComponent(entity, flipId, component);
}
