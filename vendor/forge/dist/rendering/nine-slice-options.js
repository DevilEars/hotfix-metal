import { withDefaults } from '../utilities/with-defaults.js';
/**
 * Returns a copy of `slices` with `nativeWidth`/`nativeHeight` filled in
 * from `width`/`height` wherever they're omitted. Called with a sprite's
 * size at the moment it's created or attached, so the native size is pinned
 * to the size the insets were authored against rather than to whatever
 * size the sprite is later resized to.
 * @param slices - The nine-slice configuration to resolve.
 * @param width - The width to use when `slices.nativeWidth` is omitted.
 * @param height - The height to use when `slices.nativeHeight` is omitted.
 * @returns A new `NineSliceOptions` with both native dimensions set.
 */
export function resolveNineSliceNativeSize(slices, width, height) {
    const defaultNativeSize = { nativeWidth: width, nativeHeight: height };
    return withDefaults(defaultNativeSize, slices);
}
