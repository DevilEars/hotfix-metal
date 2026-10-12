import { getMouseButtonName, } from '../../constants/index.js';
/** Mouse trigger input binding. */
export class MouseTriggerBinding {
    /** The action associated with this binding. */
    action;
    /** The mouse button associated with this binding. */
    mouseButton;
    /** The button moment associated with this binding. */
    moment;
    /** A human-readable description of this binding. */
    displayText;
    /** Constructs a new MouseTriggerBinding.
     * @param action - The action associated with this binding.
     * @param mouseButton - The mouse button associated with this binding.
     * @param moment - The button moment associated with this binding.
     */
    constructor(action, mouseButton, moment) {
        this.action = action;
        this.mouseButton = mouseButton;
        this.moment = moment;
        this.displayText = `${getMouseButtonName(mouseButton)} mouse button ${moment}`;
    }
}
