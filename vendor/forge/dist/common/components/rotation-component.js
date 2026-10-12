import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const rotationId = createComponentId('rotation');
const defaultRotationOptions = {
    local: 0,
};
/**
 * Attaches a {@link RotationEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the rotation.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addRotationComponent(world, entity, options = {}) {
    const rotationOptions = withDefaults(defaultRotationOptions, options);
    return world.addComponent(entity, rotationId, {
        ...rotationOptions,
        world: rotationOptions.local,
    });
}
