import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiSafeAreaId = createComponentId('uiSafeArea');
const defaultUiSafeAreaOptions = {
    top: true,
    right: true,
    bottom: true,
    left: true,
};
/**
 * Attaches a {@link UiSafeAreaEcsComponent} to `entity`. `entity` should
 * already be anchored with `UiAnchor.stretchAll()` - `createUiSafeAreaEcsSystem`
 * takes over its `x`/`y`/`anchoredPosition` entirely, the same way a
 * slider's handle axis is system-owned.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring which edges to inset.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addUiSafeAreaComponent(world, entity, options = {}) {
    const component = withDefaults(defaultUiSafeAreaOptions, options);
    return world.addComponent(entity, uiSafeAreaId, component);
}
