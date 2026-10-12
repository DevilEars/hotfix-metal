/**
 * Defines the mouse buttons available for input.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button#value
 */
export declare const mouseButtons: {
    readonly left: 0;
    readonly middle: 1;
    readonly right: 2;
    readonly extra1: 3;
    readonly extra2: 4;
};
/** The type of mouse button. */
export type MouseButton = (typeof mouseButtons)[keyof typeof mouseButtons];
/** Gets the name of a mouse button given its numeric value.
 * @param button - The numeric value of the mouse button.
 * @returns The name of the mouse button.
 */
export declare function getMouseButtonName(button: MouseButton): string;
