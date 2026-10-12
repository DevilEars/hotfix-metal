/** Gamepad axis-2d input binding, driven by either an analog stick or four buttons. */
export class GamepadAxis2dBinding {
    /** The action associated with this binding. */
    action;
    /** A human-readable description of this binding. */
    displayText;
    /** The gamepad axes or buttons this binding reads its value from. */
    source;
    /** Constructs a new GamepadAxis2dBinding.
     * @param action - The action associated with this binding.
     * @param source - Either an `xAxisIndex`/`yAxisIndex` pair for an analog stick, or north/south/east/west button indices for digital buttons.
     */
    constructor(action, source) {
        this.action = action;
        this.source = source;
        this.displayText =
            'xAxisIndex' in source
                ? `gamepad axes ${source.xAxisIndex}/${source.yAxisIndex}`
                : `gamepad buttons ${source.northButtonIndex}/${source.westButtonIndex}/${source.southButtonIndex}/${source.eastButtonIndex}`;
    }
}
