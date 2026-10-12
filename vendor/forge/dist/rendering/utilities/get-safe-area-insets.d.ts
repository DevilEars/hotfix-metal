/**
 * A browser viewport's safe-area insets - the margin, on each edge, that a
 * device's notch, camera cutout, rounded corners, or home indicator
 * obscures - in CSS pixels. See {@link getSafeAreaInsets}.
 */
export interface SafeAreaInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
/**
 * Reads the browser viewport's current safe-area insets (`env(safe-area-
 * inset-*)`), in CSS pixels - there's no direct JS API for these, so this
 * uses the standard technique of reading them back off a hidden probe
 * element's computed `padding`. Safe to call every frame - the probe
 * element is created once and reused, and reading computed style is cheap.
 *
 * A browser with no notch/cutout (or that doesn't support
 * `env()`) reads as all zeroes, so calling this unconditionally is always
 * safe - no feature-detection needed.
 * @returns The current safe-area insets, in CSS pixels.
 */
export declare function getSafeAreaInsets(): SafeAreaInsets;
