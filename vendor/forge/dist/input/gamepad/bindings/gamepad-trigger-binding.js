/** Gamepad trigger input binding, triggered when its button is pressed or released. */
export class GamepadTriggerBinding {
    /** The action associated with this binding. */
    action;
    /** The index of the gamepad button associated with this binding. */
    buttonIndex;
    /** The button moment associated with this binding. */
    moment;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new GamepadTriggerBinding.
     * @param action - The action associated with this binding.
     * @param buttonIndex - The index of the gamepad button associated with this binding.
     * @param moment - The button moment associated with this binding.
     */
    constructor(action, buttonIndex, moment) {
        this.action = action;
        this.buttonIndex = buttonIndex;
        this.moment = moment;
        this.displayText = `gamepad button ${buttonIndex} ${moment}`;
    }
}
