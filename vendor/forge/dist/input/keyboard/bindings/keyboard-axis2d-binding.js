/** Keyboard axis-2d input binding. */
export class KeyboardAxis2dBinding {
    /** The action associated with this binding. */
    action;
    /** The key code associated with the north direction. */
    northKeyCode;
    /** The key code associated with the south direction. */
    southKeyCode;
    /** The key code associated with the east direction. */
    eastKeyCode;
    /** The key code associated with the west direction. */
    westKeyCode;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new KeyboardAxis2dBinding.
     * @param action - The action associated with this binding.
     * @param northKeyCode - The key code associated with the north direction.
     * @param southKeyCode - The key code associated with the south direction.
     * @param eastKeyCode - The key code associated with the east direction.
     * @param westKeyCode - The key code associated with the west direction.
     */
    constructor(action, northKeyCode, southKeyCode, eastKeyCode, westKeyCode) {
        this.action = action;
        this.northKeyCode = northKeyCode;
        this.southKeyCode = southKeyCode;
        this.eastKeyCode = eastKeyCode;
        this.westKeyCode = westKeyCode;
        this.displayText = `${northKeyCode}, ${westKeyCode}, ${southKeyCode}, ${eastKeyCode} keys`;
    }
}
