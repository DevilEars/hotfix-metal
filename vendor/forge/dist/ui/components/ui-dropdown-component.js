import { createComponentId } from '../../ecs/ecs-component.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiDropdownId = createComponentId('uiDropdown');
const defaultUiDropdownOptions = {
    selectedIndex: 0,
};
/**
 * Attaches a {@link UiDropdownEcsComponent} to `entity`. Prefer
 * `createDropdown`, which builds the header/option-row entities this
 * component's `isOpen`/`selectedIndex` transitions are wired against - this
 * is exposed mainly for `createDropdown`'s own use and for tests.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the dropdown. `options` has no
 * sensible default and must always be provided, and must be non-empty.
 * @returns The attached component.
 * @throws An error if `options.options` is empty, or if `selectedIndex` is
 * out of bounds for it.
 */
export function addUiDropdownComponent(world, entity, options) {
    const { options: optionLabels, selectedIndex } = withDefaults(defaultUiDropdownOptions, options);
    if (optionLabels.length === 0) {
        throw new Error('Unable to add a UiDropdownEcsComponent with no options.');
    }
    if (selectedIndex < 0 || selectedIndex >= optionLabels.length) {
        throw new Error(`Unable to add a UiDropdownEcsComponent, selectedIndex "${selectedIndex}" is out of bounds for ${optionLabels.length} options.`);
    }
    const component = {
        options: optionLabels,
        selectedIndex,
        isOpen: false,
        onValueChanged: new ParameterizedForgeEvent('uiDropdown.onValueChanged'),
    };
    return world.addComponent(entity, uiDropdownId, component);
}
