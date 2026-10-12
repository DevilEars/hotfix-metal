/**
 * How a `MouseAxis2dBinding` measures the cursor's position. Both are
 * measured from the binding's `cursorOrigin`, with `y` increasing downward.
 */
export declare const cursorValueTypes: {
    /** The position in CSS pixels from the origin. */
    readonly absolute: "absolute";
    /**
     * The position as a fraction of the container's width and height, minus
     * the origin. With the default origin, `(0, 0)` is the container's center
     * and the edges are `±0.5`.
     */
    readonly ratio: "ratio";
};
/** The type of cursor value. */
export type CursorValueType = (typeof cursorValueTypes)[keyof typeof cursorValueTypes];
