import { getMouseButtonName } from '../../constants/index.js';
/** Mouse hold input binding. */
export class MouseHoldBinding {
    /** The action associated with this binding. */
    action;
    /** The mouse button associated with this binding. */
    mouseButton;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new MouseHoldBinding.
     * @param action - The action associated with this binding.
     * @param mouseButton - The mouse button associated with this binding.
     */
    constructor(action, mouseButton) {
        this.action = action;
        this.mouseButton = mouseButton;
        this.displayText = `${getMouseButtonName(mouseButton)} mouse button hold`;
    }
}
