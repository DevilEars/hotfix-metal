import { TriggerAction } from '../../actions/index.js';
import { ButtonMoment, GamepadButtonIndex } from '../../constants/index.js';
import { InputBinding } from '../../input-binding.js';
/** Arguments for constructing a GamepadTriggerBinding. */
export interface GamepadTriggerBindingArgs {
    /** The index of the gamepad button associated with this binding. */
    buttonIndex: GamepadButtonIndex;
    /** The button moment associated with this binding. */
    moment: ButtonMoment;
}
/** Gamepad trigger input binding, triggered when its button is pressed or released. */
export declare class GamepadTriggerBinding implements InputBinding<TriggerAction>, GamepadTriggerBindingArgs {
    /** The action associated with this binding. */
    readonly action: TriggerAction;
    /** The index of the gamepad button associated with this binding. */
    readonly buttonIndex: GamepadButtonIndex;
    /** The button moment associated with this binding. */
    readonly moment: ButtonMoment;
    /** A human-readable description of this binding. */
    readonly displayText: string;
    /** Constructs a new GamepadTriggerBinding.
     * @param action - The action associated with this binding.
     * @param buttonIndex - The index of the gamepad button associated with this binding.
     * @param moment - The button moment associated with this binding.
     */
    constructor(action: TriggerAction, buttonIndex: GamepadButtonIndex, moment: ButtonMoment);
}
