import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const gravityId = createComponentId('gravity');
/**
 * Attaches a {@link GravityEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the gravity.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addGravityComponent(world, entity, options = {}) {
    const defaultGravityOptions = {
        amount: { x: 0, y: -9.81 },
    };
    const component = withDefaults(defaultGravityOptions, options);
    return world.addComponent(entity, gravityId, component);
}
