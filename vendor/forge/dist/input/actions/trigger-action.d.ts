import { InputAction } from '../input-action.js';
import { ForgeEvent } from '../../events/index.js';
/**
 * An action that represents a trigger input, such as pressing a button or
 * key. Read-only to game code: its `InputManager` fires it when a binding's
 * button goes down or comes up.
 */
export declare class TriggerAction implements InputAction {
    readonly name: string;
    /** Event that is raised when the action is triggered. */
    readonly triggerEvent: ForgeEvent;
    readonly inputGroup: string;
    private _triggered;
    /** Creates a new TriggerAction.
     * @param name - The name of the action.
     * @param inputGroup - The input group this action belongs to. Defaults to `'game'`.
     */
    constructor(name: string, inputGroup?: string);
    /** Gets whether the action was triggered this frame. */
    get isTriggered(): boolean;
}
/**
 * Marks `action` as triggered for the rest of the frame and raises
 * `triggerEvent`. Internal to the input module and not exported from it:
 * `InputManager` is the only writer of action state.
 * @param action - The action to fire.
 */
export declare const fireTriggerAction: (action: TriggerAction) => void;
/**
 * Clears `action`'s `isTriggered` at the end of the frame. Internal to the
 * input module, see `fireTriggerAction`.
 * @param action - The action to clear.
 */
export declare const clearTriggerAction: (action: TriggerAction) => void;
