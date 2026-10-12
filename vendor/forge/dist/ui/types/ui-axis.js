import { withDefaults } from '../../utilities/with-defaults.js';
const defaultUiPointAxisOptions = {
    size: 100,
    sizeUnit: 'referencePixels',
};
const defaultUiStretchAxisOptions = {
    margin: 0,
    pivot: 0.5,
    marginUnit: 'referencePixels',
};
/**
 * Factories for {@link UiAxis}. Use these (rather than a raw object literal)
 * to build one axis of a `RectTransformEcsComponent.x`/`.y`, or of a
 * `UiAnchor` preset's own `x`/`y`.
 */
export const UiAxis = {
    /**
     * Creates a {@link UiPointAxis}.
     * @param anchor - Normalized anchor position within the parent's rect on this axis.
     * @param options - Options for configuring the axis. `pivot` defaults to `anchor`; `size` defaults to `100`.
     * @returns The point axis.
     */
    point: (anchor, options = {}) => {
        const { size, pivot, sizeUnit } = withDefaults({ ...defaultUiPointAxisOptions, pivot: anchor }, options);
        return { kind: 'point', anchor, pivot, size, sizeUnit };
    },
    /**
     * Creates a {@link UiStretchAxis}.
     * @param range - The normalized `[min, max]` span this axis anchors to within the parent's rect.
     * @param options - Options for configuring the axis. `margin` defaults to `0`; `pivot` defaults to `0.5`.
     * @returns The stretch axis.
     */
    stretch: (range, options = {}) => {
        const { margin, pivot, marginUnit } = withDefaults(defaultUiStretchAxisOptions, options);
        return {
            kind: 'stretch',
            anchorMin: range.min,
            anchorMax: range.max,
            pivot,
            margin,
            marginUnit,
        };
    },
};
/**
 * Reads a {@link UiAxis}'s literal size (`UiPointAxis.size`) or margin
 * (`UiStretchAxis.margin`) - whichever field this axis's `kind` actually
 * has - without the caller needing to branch on `kind` itself. Useful for
 * code that treats an axis as an opaque "the number that isn't the
 * anchor/pivot" regardless of what it means, e.g. a layout group falling
 * back to an unmanaged child's own current size on an axis it doesn't
 * control.
 * @param axis - The axis to read.
 * @returns `axis.size` for a point axis, `axis.margin` for a stretch axis.
 */
export function uiAxisValue(axis) {
    return axis.kind === 'point' ? axis.size : axis.margin;
}
/**
 * Returns a copy of `axis` with its size (`UiPointAxis.size`) or margin
 * (`UiStretchAxis.margin`) replaced by `value` - whichever field this
 * axis's `kind` actually has - leaving `anchor`(s)/`pivot` untouched. The
 * write-side counterpart to {@link uiAxisValue}.
 * @param axis - The axis to copy.
 * @param value - The new size (for a point axis) or margin (for a stretch axis).
 * @returns The updated axis.
 */
export function withUiAxisValue(axis, value) {
    return axis.kind === 'point'
        ? { ...axis, size: value }
        : { ...axis, margin: value };
}
/**
 * Drives a {@link UiAxis} to a new normalized anchor position - `anchor` for
 * a `UiPointAxis`, `anchorMax` for a `UiStretchAxis` - mutating it in place
 * and leaving `pivot`/`size`/`margin`/`anchorMin` untouched. The mechanism
 * `createUiSliderEcsSystem` uses to slide a handle along a track from a
 * normalized `[0, 1]` value every tick.
 * @param axis - The axis to mutate.
 * @param value - The new normalized anchor position.
 */
export function driveUiAxis(axis, value) {
    if (axis.kind === 'point') {
        axis.anchor = value;
    }
    else {
        axis.anchorMax = value;
    }
}
