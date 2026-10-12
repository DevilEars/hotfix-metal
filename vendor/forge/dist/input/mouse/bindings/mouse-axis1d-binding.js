/**
 * Mouse axis 1D input binding for the scroll wheel. Sets its action to the
 * sum of `WheelEvent.deltaY / 100` over the frame's `wheel` events, and
 * back to `0` when the `InputManager` resets at the end of the frame.
 */
export class MouseAxis1dBinding {
    /** The action associated with this binding. */
    action;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new MouseAxis1dBinding.
     * @param action - The action associated with this binding.
     */
    constructor(action) {
        this.action = action;
        this.displayText = 'mouse scroll';
    }
}
