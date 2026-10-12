/**
 * Horizontal alignment values for `TextEcsComponent.horizontalAlign`. See
 * that field's own doc comment for what each value does.
 */
export declare const textHorizontalAlignments: {
    readonly left: "left";
    readonly center: "center";
    readonly right: "right";
    readonly justify: "justify";
};
/** A value of {@link textHorizontalAlignments}. */
export type TextHorizontalAlign = (typeof textHorizontalAlignments)[keyof typeof textHorizontalAlignments];
/**
 * Vertical alignment values for `TextEcsComponent.verticalAlign`. See that
 * field's own doc comment for what each value does.
 */
export declare const textVerticalAlignments: {
    readonly top: "top";
    readonly middle: "middle";
    readonly bottom: "bottom";
    readonly baseline: "baseline";
    readonly capline: "capline";
};
/** A value of {@link textVerticalAlignments}. */
export type TextVerticalAlign = (typeof textVerticalAlignments)[keyof typeof textVerticalAlignments];
