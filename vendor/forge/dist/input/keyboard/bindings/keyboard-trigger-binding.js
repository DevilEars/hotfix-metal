/** Keyboard trigger input binding. */
export class KeyboardTriggerBinding {
    /** The action associated with this binding. */
    action;
    /** The key code associated with this binding. */
    keyCode;
    /** The button moment associated with this binding. */
    moment;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new KeyboardTriggerBinding.
     * @param action - The action associated with this binding.
     * @param keyCode - The key code associated with this binding.
     * @param moment - The button moment associated with this binding.
     */
    constructor(action, keyCode, moment) {
        this.action = action;
        this.keyCode = keyCode;
        this.moment = moment;
        this.displayText = `${keyCode} key ${moment}`;
    }
}
