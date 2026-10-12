/** Gamepad axis-1d input binding, driven by either an analog stick or a pair of buttons. */
export class GamepadAxis1dBinding {
    /** The action associated with this binding. */
    action;
    /** A human-readable description of this binding. */
    displayText;
    /** The gamepad axis or buttons this binding reads its value from. */
    source;
    /** Constructs a new GamepadAxis1dBinding.
     * @param action - The action associated with this binding.
     * @param source - Either an `axisIndex` for an analog stick, or a `positiveButtonIndex`/`negativeButtonIndex` pair for digital buttons.
     */
    constructor(action, source) {
        this.action = action;
        this.source = source;
        this.displayText =
            'axisIndex' in source
                ? `gamepad axis ${source.axisIndex}`
                : `gamepad buttons ${source.negativeButtonIndex}/${source.positiveButtonIndex}`;
    }
}
