import { InputAction } from '../input-action.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
/**
 * An action that represents a 1-dimensional axis input, such as a gamepad
 * trigger or mouse scroll. Read-only to game code: its `InputManager`
 * derives its value from what the input sources bound to it report.
 */
export declare class Axis1dAction implements InputAction {
    readonly name: string;
    /**
     * Event that is raised whenever the axis value changes.
     * The new value is passed as a parameter to the event listeners.
     */
    readonly valueChangeEvent: ParameterizedForgeEvent<number>;
    readonly inputGroup: string;
    private _value;
    /**
     * Creates a new Axis1dAction.
     * @param name - The name of the action.
     * @param inputGroup - The input group this action belongs to. Defaults to `'game'`.
     */
    constructor(name: string, inputGroup?: string);
    /** Gets the current value of the axis, ranging from -1 to 1. */
    get value(): number;
}
/**
 * Sets `action`'s value, clamped to the range -1 to 1, raising
 * `valueChangeEvent` if it changed. Internal to the input module and not
 * exported from it: `InputManager` is the only writer of action state.
 * @param action - The action to write.
 * @param value - The new value.
 */
export declare const setAxis1dActionValue: (action: Axis1dAction, value: number) => void;
