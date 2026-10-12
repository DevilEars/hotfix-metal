import { createComponentId } from '../../ecs/ecs-component.js';
import { ForgeEvent, ParameterizedForgeEvent } from '../../events/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const textInputId = createComponentId('textInput');
const defaultTextInputOptions = {
    maxLength: Number.POSITIVE_INFINITY,
    attributes: {},
};
/**
 * Attaches a {@link TextInputEcsComponent} to `entity`. Needs a
 * `RectTransformEcsComponent` and a `UiInteractableEcsComponent` on the
 * same entity; use `createTextInput` to build a whole field.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - The field's entry, part entities and settings, plus an
 * optional initial `value`.
 * @returns The attached component.
 */
export function addTextInputComponent(world, entity, options) {
    const { value, ...rest } = options;
    if (value !== undefined) {
        options.entry.setValue(value);
    }
    const component = {
        ...withDefaults(defaultTextInputOptions, rest),
        value: options.entry.value,
        isEditing: false,
        onValueChanged: new ParameterizedForgeEvent('textInput.onValueChanged'),
        onSubmit: new ParameterizedForgeEvent('textInput.onSubmit'),
        onCancel: new ForgeEvent('textInput.onCancel'),
    };
    return world.addComponent(entity, textInputId, component);
}
/**
 * Replaces a text field's text, e.g. to clear or prefill it. The text goes
 * through the field's filters like typed text, and `value` and
 * `onValueChanged` update on the next tick.
 * @param world - The ECS world `field` belongs to.
 * @param field - The text field entity.
 * @param value - The new text.
 * @throws An error if `field` has no `TextInputEcsComponent`.
 */
export function setTextInputValue(world, field, value) {
    world
        .getComponentRequired(field, textInputId)
        .entry.setValue(value);
}
/**
 * Starts editing a text field, as a tap on it would, e.g. when its panel
 * opens. `isEditing` updates on the next tick. A phone only opens its
 * keyboard when this is called inside a user gesture's event handler; taps
 * on the field itself always are.
 * @param world - The ECS world `field` belongs to.
 * @param field - The text field entity.
 * @throws An error if `field` has no `TextInputEcsComponent`.
 */
export function editTextInput(world, field) {
    world
        .getComponentRequired(field, textInputId)
        .entry.focus();
}
