/**
 * A mapping of human-readable button names to their corresponding indices
 * in the W3C Standard Gamepad's `buttons` array.
 * @see https://www.w3.org/TR/gamepad/#remapping
 */
export declare const gamepadButtons: {
    readonly faceButtonBottom: 0;
    readonly faceButtonRight: 1;
    readonly faceButtonLeft: 2;
    readonly faceButtonTop: 3;
    readonly leftShoulder: 4;
    readonly rightShoulder: 5;
    readonly leftTrigger: 6;
    readonly rightTrigger: 7;
    readonly select: 8;
    readonly start: 9;
    readonly leftStick: 10;
    readonly rightStick: 11;
    readonly dpadUp: 12;
    readonly dpadDown: 13;
    readonly dpadLeft: 14;
    readonly dpadRight: 15;
    readonly home: 16;
};
/** The index of a button in a gamepad's `buttons` array. */
export type GamepadButtonIndex = (typeof gamepadButtons)[keyof typeof gamepadButtons];
