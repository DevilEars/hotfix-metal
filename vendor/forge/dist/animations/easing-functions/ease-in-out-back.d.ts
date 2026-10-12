/**
 * Easing function for "easeInOutBack".
 *
 * This function accelerates from zero velocity, creating a "wind up" effect and overshoots the end value before returning to it.
 *
 * @param t - The input value (typically between 0 and 1).
 * @returns The eased value.
 *
 * @see {@link https://easings.net/#easeInOutBack}
 */
export declare function easeInOutBack(t: number): number;
