/**
 * A mapping of human-readable axis names to their corresponding indices in
 * the W3C Standard Gamepad's `axes` array. `GamepadInputSource` reads the Y
 * axes with up as positive, flipping the W3C convention to match the rest of
 * the engine.
 * @see https://www.w3.org/TR/gamepad/#remapping
 */
export declare const gamepadAxes: {
    readonly leftStickX: 0;
    readonly leftStickY: 1;
    readonly rightStickX: 2;
    readonly rightStickY: 3;
};
/** The index of an axis in a gamepad's `axes` array. */
export type GamepadAxisIndex = (typeof gamepadAxes)[keyof typeof gamepadAxes];
