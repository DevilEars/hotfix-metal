/** Defines the moments of a button press. */
export declare const buttonMoments: {
    /** The button was just released. */
    readonly up: "up";
    /** The button was just pressed down. */
    readonly down: "down";
};
/** The type of button moment. */
export type ButtonMoment = (typeof buttonMoments)[keyof typeof buttonMoments];
