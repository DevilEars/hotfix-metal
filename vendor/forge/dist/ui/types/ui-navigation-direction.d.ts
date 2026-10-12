/**
 * The four directions `createUiNavigationEcsSystem` can move focus in,
 * derived from each of a canvas's `navigateInput` presses (see
 * `Axis2dAction.presses`).
 */
export declare const uiNavigationDirections: {
    readonly up: "up";
    readonly down: "down";
    readonly left: "left";
    readonly right: "right";
};
/** A value of {@link uiNavigationDirections}. */
export type UiNavigationDirection = (typeof uiNavigationDirections)[keyof typeof uiNavigationDirections];
