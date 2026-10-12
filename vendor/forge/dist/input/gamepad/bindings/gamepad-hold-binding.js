/** Gamepad hold input binding, held for as long as its button is pressed. */
export class GamepadHoldBinding {
    /** The action associated with this binding. */
    action;
    /** The index of the gamepad button associated with this binding. */
    buttonIndex;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new GamepadHoldBinding.
     * @param action - The action associated with this binding.
     * @param buttonIndex - The index of the gamepad button associated with this binding.
     */
    constructor(action, buttonIndex) {
        this.action = action;
        this.buttonIndex = buttonIndex;
        this.displayText = `gamepad button ${buttonIndex} hold`;
    }
}
