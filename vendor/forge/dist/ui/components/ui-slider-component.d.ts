import { EcsWorld } from '../../ecs/ecs-world.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
/**
 * Fields of {@link UiSliderEcsComponent} with no sensible default; callers
 * must always provide these.
 */
export interface UiSliderRequiredOptions {
    /**
     * The entity id of the slider's drag handle - a child `RectTransformEcsComponent`
     * whose `anchorMin.x`/`anchorMax.x` `createUiSliderEcsSystem` drives to
     * track `value` every tick.
     */
    handle: number;
}
/**
 * Fields of {@link UiSliderEcsComponent} with a sensible default, or that are
 * genuinely optional (no default at all); callers may omit these.
 */
export interface UiSliderDefaultedOptions {
    /** The value `value` maps to at the track's left edge. Defaults to `0`. */
    minValue: number;
    /** The value `value` maps to at the track's right edge. Defaults to `1`. */
    maxValue: number;
    /** The slider's current value, clamped to `[minValue, maxValue]`. Defaults to `minValue`. */
    value: number;
    /** Rounds `value` to the nearest whole number whenever it's set by a drag. Defaults to `false`. */
    wholeNumbers: boolean;
    /**
     * The entity id of an optional fill visual: a child covering the track
     * with a linear `MaskEcsComponent` from the left, whose `shape.amount`
     * `createUiSliderEcsSystem` sets from `value` every tick.
     */
    fill?: number;
}
/**
 * A horizontal drag track holding a numeric value between `minValue` and
 * `maxValue`. Attach alongside a `UiInteractableEcsComponent` (the drag
 * surface `createUiSliderEcsSystem` reads pointer position against) and a
 * `RectTransformEcsComponent`; use `createSlider` for the common "track +
 * handle + fill" visual assembly, or build your own from these same pieces.
 */
export interface UiSliderEcsComponent extends UiSliderRequiredOptions, UiSliderDefaultedOptions {
    /**
     * Raised when a press or drag on the track changes `value`. Not raised
     * by a direct write to `value`, though `createUiSliderEcsSystem` still
     * moves the handle and fill to it. Passes the new value.
     */
    readonly onValueChanged: ParameterizedForgeEvent<number>;
}
export declare const uiSliderId: import("../../ecs/ecs-component.js").ComponentKey<UiSliderEcsComponent>;
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
export declare function addUiSliderComponent(world: EcsWorld, entity: number, options: UiSliderRequiredOptions & Partial<UiSliderDefaultedOptions>): UiSliderEcsComponent;
/**
 * Normalizes `slider.value` to a `0`-`1` fraction of the way from `minValue`
 * to `maxValue` - the anchor fraction `createUiSliderEcsSystem` drives the
 * handle with, and the fill's mask amount.
 * @param slider - The slider's `value`/`minValue`/`maxValue`.
 * @returns The normalized fraction, clamped to `[0, 1]`. `0` if `minValue`
 * and `maxValue` coincide (a zero-length range has no meaningful fraction).
 */
export declare function normalizeUiSliderValue(slider: Pick<UiSliderEcsComponent, 'value' | 'minValue' | 'maxValue'>): number;
/**
 * Converts a `0`-`1` fraction back into a value in `[minValue, maxValue]`,
 * rounding to the nearest whole number when `wholeNumbers` is set - the
 * inverse of `normalizeUiSliderValue`, used by `createUiSliderEcsSystem` to
 * turn a drag position back into a value.
 * @param slider - The slider's `minValue`/`maxValue`/`wholeNumbers`.
 * @param t - The normalized fraction, clamped to `[0, 1]` before use.
 * @returns The denormalized value.
 */
export declare function denormalizeUiSliderValue(slider: Pick<UiSliderEcsComponent, 'minValue' | 'maxValue' | 'wholeNumbers'>, t: number): number;
