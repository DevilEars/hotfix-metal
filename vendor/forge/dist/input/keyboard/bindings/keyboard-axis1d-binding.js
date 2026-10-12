/** Keyboard axis-1d input binding. */
export class KeyboardAxis1dBinding {
    /** The action associated with this binding. */
    action;
    /** The key code associated with the positive direction. */
    positiveKeyCode;
    /** The key code associated with the negative direction. */
    negativeKeyCode;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new KeyboardAxis1dBinding.
     * @param action - The action associated with this binding.
     * @param positiveKeyCode - The key code for the positive direction.
     * @param negativeKeyCode - The key code for the negative direction.
     */
    constructor(action, positiveKeyCode, negativeKeyCode) {
        this.action = action;
        this.positiveKeyCode = positiveKeyCode;
        this.negativeKeyCode = negativeKeyCode;
        this.displayText = `${negativeKeyCode}, ${positiveKeyCode} keys`;
    }
}
