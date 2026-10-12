import { TriggerAction } from '../../actions/index.js';
import { ButtonMoment, KeyCode } from '../../constants/index.js';
import { InputBinding } from '../../input-binding.js';
/** Arguments for constructing a KeyboardTriggerBinding. */
export interface KeyboardTriggerBindingArgs {
    /** The key code associated with this binding. */
    keyCode: KeyCode;
    /** The button moment associated with this binding. */
    moment: ButtonMoment;
}
/** Keyboard trigger input binding. */
export declare class KeyboardTriggerBinding implements InputBinding<TriggerAction>, KeyboardTriggerBindingArgs {
    /** The action associated with this binding. */
    readonly action: TriggerAction;
    /** The key code associated with this binding. */
    readonly keyCode: KeyCode;
    /** The button moment associated with this binding. */
    readonly moment: ButtonMoment;
    /** A human-readable description of this binding. */
    readonly displayText: string;
    /** Constructs a new KeyboardTriggerBinding.
     * @param action - The action associated with this binding.
     * @param keyCode - The key code associated with this binding.
     * @param moment - The button moment associated with this binding.
     */
    constructor(action: TriggerAction, keyCode: KeyCode, moment: ButtonMoment);
}
