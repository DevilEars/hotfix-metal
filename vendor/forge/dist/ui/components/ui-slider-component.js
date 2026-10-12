import { createComponentId } from '../../ecs/ecs-component.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
import { clamp, lerp } from '../../math/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiSliderId = createComponentId('uiSlider');
const defaultUiSliderOptions = {
    minValue: 0,
    maxValue: 1,
    wholeNumbers: false,
};
/**
 * Attaches a {@link UiSliderEcsComponent} to `entity`. Needs a
 * `UiInteractableEcsComponent` on the same entity for
 * `createUiSliderEcsSystem` to read drag gestures from.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the slider. `handle` has no
 * sensible default and must always be provided; `value` defaults to
 * `minValue`.
 * @returns The attached component, for further tuning, listening to
 * `onValueChanged`, or reading/setting `value` directly.
 */
export function addUiSliderComponent(world, entity, options) {
    const merged = withDefaults(defaultUiSliderOptions, options);
    const value = clamp(options.value ?? merged.minValue, merged.minValue, merged.maxValue);
    const component = {
        ...merged,
        value,
        onValueChanged: new ParameterizedForgeEvent('uiSlider.onValueChanged'),
    };
    return world.addComponent(entity, uiSliderId, component);
}
/**
 * Normalizes `slider.value` to a `0`-`1` fraction of the way from `minValue`
 * to `maxValue` - the anchor fraction `createUiSliderEcsSystem` drives the
 * handle with, and the fill's mask amount.
 * @param slider - The slider's `value`/`minValue`/`maxValue`.
 * @returns The normalized fraction, clamped to `[0, 1]`. `0` if `minValue`
 * and `maxValue` coincide (a zero-length range has no meaningful fraction).
 */
export function normalizeUiSliderValue(slider) {
    const range = slider.maxValue - slider.minValue;
    return range > 0 ? clamp((slider.value - slider.minValue) / range, 0, 1) : 0;
}
/**
 * Converts a `0`-`1` fraction back into a value in `[minValue, maxValue]`,
 * rounding to the nearest whole number when `wholeNumbers` is set - the
 * inverse of `normalizeUiSliderValue`, used by `createUiSliderEcsSystem` to
 * turn a drag position back into a value.
 * @param slider - The slider's `minValue`/`maxValue`/`wholeNumbers`.
 * @param t - The normalized fraction, clamped to `[0, 1]` before use.
 * @returns The denormalized value.
 */
export function denormalizeUiSliderValue(slider, t) {
    const value = lerp(slider.minValue, slider.maxValue, clamp(t, 0, 1));
    return slider.wholeNumbers ? Math.round(value) : value;
}
