import { InputAction } from '../input-action.js';
import { ForgeEvent } from '../../events/index.js';
/**
 * An action that represents a hold input, such as holding down a button or
 * key. Read-only to game code: its `InputManager` derives whether it's held
 * from what the input sources bound to it report.
 */
export declare class HoldAction implements InputAction {
    readonly name: string;
    /** Event that is raised when the hold starts. */
    readonly holdStartEvent: ForgeEvent;
    /** Event that is raised when the hold ends. */
    readonly holdEndEvent: ForgeEvent;
    readonly inputGroup: string;
    private _held;
    /** Creates a new HoldAction.
     * @param name - The name of the action.
     * @param inputGroup - The input group this action belongs to. Defaults to `'game'`.
     */
    constructor(name: string, inputGroup?: string);
    /** Gets whether the action is currently being held. */
    get isHeld(): boolean;
}
/**
 * Starts or ends `action`'s hold, raising `holdStartEvent` or `holdEndEvent`
 * if it changed. Internal to the input module and not exported from it:
 * `InputManager` is the only writer of action state.
 * @param action - The action to write.
 * @param isHeld - Whether the action is held.
 */
export declare const setHoldActionHeld: (action: HoldAction, isHeld: boolean) => void;
