import { createComponentId } from '../../ecs/ecs-component.js';
import { formatEntity } from '../../ecs/entity.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const stateScopedId = createComponentId('stateScoped');
const defaultStateScopedOptions = {
    removeOnExit: [],
    removeOnEnter: [],
};
/**
 * Attaches a {@link StateScopedEcsComponent} to `entity`, so it's removed
 * when `state` leaves one of `removeOnExit` or enters one of
 * `removeOnEnter`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - The state, and the transitions that remove the entity.
 * @returns The attached component.
 * @throws An error if both `removeOnExit` and `removeOnEnter` are empty,
 * since the entity would never be removed.
 */
export function addStateScopedComponent(world, entity, options) {
    const component = withDefaults(defaultStateScopedOptions, options);
    if (component.removeOnExit.length === 0 &&
        component.removeOnEnter.length === 0) {
        throw new Error(`Unable to add a state-scoped component to entity ${formatEntity(entity)}, neither "removeOnExit" nor "removeOnEnter" lists a state, so it would never be removed.`);
    }
    world.addComponent(entity, stateScopedId, component);
    return component;
}
