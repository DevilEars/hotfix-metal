import { clamp } from '../../math/index.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
let writeValue;
/**
 * An action that represents a 1-dimensional axis input, such as a gamepad
 * trigger or mouse scroll. Read-only to game code: its `InputManager`
 * derives its value from what the input sources bound to it report.
 */
export class Axis1dAction {
    name;
    /**
     * Event that is raised whenever the axis value changes.
     * The new value is passed as a parameter to the event listeners.
     */
    valueChangeEvent;
    inputGroup;
    _value = 0;
    static {
        writeValue = (action, value) => {
            const clampedValue = clamp(value, -1, 1);
            if (action._value === clampedValue) {
                return;
            }
            action._value = clampedValue;
            action.valueChangeEvent.raise(action._value);
        };
    }
    /**
     * Creates a new Axis1dAction.
     * @param name - The name of the action.
     * @param inputGroup - The input group this action belongs to. Defaults to `'game'`.
     */
    constructor(name, inputGroup) {
        this.name = name;
        this.valueChangeEvent = new ParameterizedForgeEvent('Axis1d Value Change Event');
        this.inputGroup = inputGroup ?? 'game';
    }
    /** Gets the current value of the axis, ranging from -1 to 1. */
    get value() {
        return this._value;
    }
}
/**
 * Sets `action`'s value, clamped to the range -1 to 1, raising
 * `valueChangeEvent` if it changed. Internal to the input module and not
 * exported from it: `InputManager` is the only writer of action state.
 * @param action - The action to write.
 * @param value - The new value.
 */
export const setAxis1dActionValue = (action, value) => {
    writeValue(action, value);
};
