import { ForgeEvent } from '../../events/index.js';
let writeTriggered;
/**
 * An action that represents a trigger input, such as pressing a button or
 * key. Read-only to game code: its `InputManager` fires it when a binding's
 * button goes down or comes up.
 */
export class TriggerAction {
    name;
    /** Event that is raised when the action is triggered. */
    triggerEvent;
    inputGroup;
    _triggered = false;
    static {
        writeTriggered = (action, isTriggered) => {
            action._triggered = isTriggered;
            if (isTriggered) {
                action.triggerEvent.raise();
            }
        };
    }
    /** Creates a new TriggerAction.
     * @param name - The name of the action.
     * @param inputGroup - The input group this action belongs to. Defaults to `'game'`.
     */
    constructor(name, inputGroup) {
        this.name = name;
        this.triggerEvent = new ForgeEvent('Trigger Event');
        this.inputGroup = inputGroup ?? 'game';
    }
    /** Gets whether the action was triggered this frame. */
    get isTriggered() {
        return this._triggered;
    }
}
/**
 * Marks `action` as triggered for the rest of the frame and raises
 * `triggerEvent`. Internal to the input module and not exported from it:
 * `InputManager` is the only writer of action state.
 * @param action - The action to fire.
 */
export const fireTriggerAction = (action) => {
    writeTriggered(action, true);
};
/**
 * Clears `action`'s `isTriggered` at the end of the frame. Internal to the
 * input module, see `fireTriggerAction`.
 * @param action - The action to clear.
 */
export const clearTriggerAction = (action) => {
    writeTriggered(action, false);
};
