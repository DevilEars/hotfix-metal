import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiToggleGroupId = createComponentId('uiToggleGroup');
const defaultUiToggleGroupOptions = {
    allowSwitchOff: false,
};
/**
 * Attaches a {@link UiToggleGroupEcsComponent} to `entity`, making it a
 * radio-group root: any `UiToggleEcsComponent` whose `group` references this
 * entity id is mutually exclusive with every other toggle referencing the
 * same group (see `createUiToggleEcsSystem`). The group entity itself is
 * purely logical - it needs no `RectTransformEcsComponent` and doesn't have
 * to be an ancestor of the toggles it groups.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the group.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addUiToggleGroupComponent(world, entity, options = {}) {
    const component = withDefaults(defaultUiToggleGroupOptions, options);
    return world.addComponent(entity, uiToggleGroupId, component);
}
