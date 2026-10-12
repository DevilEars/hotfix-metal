import { Vec2 } from '../../math/index.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
let writeValue;
let clearPresses;
/**
 * The length an `Axis2dAction`'s value has to reach to count as a press
 * (see `Axis2dAction.presses`): half of a fully pushed stick or a held key.
 */
export const axisPressThreshold = 0.5;
const isPressed = (x, y) => Math.hypot(x, y) >= axisPressThreshold;
/**
 * An action that represents a 2-dimensional axis input, such as a joystick
 * or mouse position. Read-only to game code: its `InputManager` derives its
 * value from what the input sources bound to it report.
 */
export class Axis2dAction {
    name;
    /**
     * Event that is raised whenever the axis value changes.
     * The new value is passed as a parameter to the event listeners.
     */
    valueChangeEvent;
    inputGroup;
    _value = Vec2.zero;
    _presses = [];
    static {
        writeValue = (action, x, y) => {
            if (action._value.x === x && action._value.y === y) {
                return;
            }
            if (!isPressed(action._value.x, action._value.y) && isPressed(x, y)) {
                action._presses.push({ x, y });
            }
            action._value.x = x;
            action._value.y = y;
            action.valueChangeEvent.raise(action._value);
        };
        clearPresses = (action) => {
            action._presses.length = 0;
        };
    }
    /**
     * Creates a new Axis2dAction.
     * @param name - The name of the action.
     * @param inputGroup - The input group this action belongs to. Defaults to `'game'`.
     */
    constructor(name, inputGroup) {
        this.name = name;
        this.valueChangeEvent = new ParameterizedForgeEvent('Axis2d Value Change Event');
        this.inputGroup = inputGroup ?? 'game';
    }
    /**
     * Gets the current value of the axis. The `InputManager` updates this
     * vector in place, so copy it to keep a value from an earlier frame.
     */
    get value() {
        return this._value;
    }
    /**
     * The value the axis had each time its length rose to
     * {@link axisPressThreshold} or more this frame, oldest first. Cleared at
     * the end of every frame by `InputManager.reset`.
     *
     * Use it to act on presses rather than on the current value, as UI focus
     * navigation does: a key pressed and released between two frames, which
     * `value` never shows, is still one press, and two taps in one frame are
     * two. Holding the axis past the threshold is one press, on the frame it
     * crossed.
     */
    get presses() {
        return this._presses;
    }
}
/**
 * Sets `action`'s value, raising `valueChangeEvent` if it changed. Internal
 * to the input module and not exported from it: `InputManager` is the only
 * writer of action state.
 * @param action - The action to write.
 * @param x - The new x value.
 * @param y - The new y value.
 */
export const setAxis2dActionValue = (action, x, y) => {
    writeValue(action, x, y);
};
/**
 * Forgets `action`'s presses at the end of the frame. Internal to the
 * input module, see `setAxis2dActionValue`.
 * @param action - The action to clear.
 */
export const clearAxis2dActionPresses = (action) => {
    clearPresses(action);
};
