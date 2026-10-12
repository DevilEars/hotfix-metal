import { createComponentId } from '../../ecs/ecs-component.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiToggleId = createComponentId('uiToggle');
const defaultUiToggleOptions = {
    isOn: false,
};
/**
 * Attaches a {@link UiToggleEcsComponent} to `entity`. Needs a
 * `UiInteractableEcsComponent` on the same entity for
 * `createUiToggleEcsSystem` to flip `isOn` on invocation.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the toggle. `isOn` defaults to
 * `false`; `group` is omitted by default (an independent checkbox).
 * @returns The attached component, for further tuning, listening to
 * `onValueChanged`, or reading/setting `isOn` directly.
 */
export function addUiToggleComponent(world, entity, options = {}) {
    const component = {
        ...withDefaults(defaultUiToggleOptions, options),
        onValueChanged: new ParameterizedForgeEvent('uiToggle.onValueChanged'),
    };
    return world.addComponent(entity, uiToggleId, component);
}
