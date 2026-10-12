/** Keyboard hold input binding. */
export class KeyboardHoldBinding {
    /** The action associated with this binding. */
    action;
    /** The key code associated with this binding. */
    keyCode;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new KeyboardHoldBinding.
     * @param action - The action associated with this binding.
     * @param keyCode - The key code associated with this binding.
     */
    constructor(action, keyCode) {
        this.action = action;
        this.keyCode = keyCode;
        this.displayText = `${keyCode} key hold`;
    }
}
