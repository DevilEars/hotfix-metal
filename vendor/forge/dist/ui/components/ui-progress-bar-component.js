import { createComponentId } from '../../ecs/ecs-component.js';
import { clamp } from '../../math/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiProgressBarId = createComponentId('uiProgressBar');
const defaultUiProgressBarOptions = {
    minValue: 0,
    maxValue: 1,
};
/**
 * Attaches a {@link UiProgressBarEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the progress bar. `fill` has no
 * sensible default and must always be provided; `value` defaults to
 * `minValue`.
 * @returns The attached component, for reading/setting `value` directly.
 */
export function addUiProgressBarComponent(world, entity, options) {
    const merged = withDefaults(defaultUiProgressBarOptions, options);
    const value = clamp(options.value ?? merged.minValue, merged.minValue, merged.maxValue);
    const component = { ...merged, value };
    return world.addComponent(entity, uiProgressBarId, component);
}
/**
 * Normalizes `progressBar.value` to a `0`-`1` fraction of the way from
 * `minValue` to `maxValue` - the mask amount
 * `createUiProgressBarEcsSystem` reveals the fill with.
 * @param progressBar - The progress bar's `value`/`minValue`/`maxValue`.
 * @returns The normalized fraction, clamped to `[0, 1]`. `0` if `minValue`
 * and `maxValue` coincide (a zero-length range has no meaningful fraction).
 */
export function normalizeUiProgressBarValue(progressBar) {
    const range = progressBar.maxValue - progressBar.minValue;
    return range > 0
        ? clamp((progressBar.value - progressBar.minValue) / range, 0, 1)
        : 0;
}
