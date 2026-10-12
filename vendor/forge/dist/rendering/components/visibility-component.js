import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const visibilityId = createComponentId('visibility');
const defaultVisibilityOptions = {
    visible: true,
};
/**
 * Attaches a {@link VisibilityEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the visibility.
 * @returns The attached component, for showing and hiding the entity at
 * runtime.
 */
export function addVisibilityComponent(world, entity, options = {}) {
    const component = withDefaults(defaultVisibilityOptions, options);
    return world.addComponent(entity, visibilityId, component);
}
/**
 * Whether `entity` is visible in the hierarchy: `false` if it or any of
 * its ancestors has a {@link VisibilityEcsComponent} with `visible: false`.
 * Walks up the parent chain, so it's computed fresh on every call.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to check.
 * @returns `true` unless `entity` or an ancestor is hidden.
 */
export function isVisibleInHierarchy(world, entity) {
    const getVisibility = world.getComponentAccessor(visibilityId);
    for (let current = entity; current !== null; current = world.getParent(current)) {
        if (getVisibility(current)?.visible === false) {
            return false;
        }
    }
    return true;
}
