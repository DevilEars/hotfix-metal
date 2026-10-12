import { HoldAction } from '../../actions/index.js';
import { GamepadButtonIndex } from '../../constants/index.js';
import { InputBinding } from '../../input-binding.js';
/** Arguments for constructing a GamepadHoldBinding. */
export interface GamepadHoldBindingArgs {
    /** The index of the gamepad button associated with this binding. */
    buttonIndex: GamepadButtonIndex;
}
/** Gamepad hold input binding, held for as long as its button is pressed. */
export declare class GamepadHoldBinding implements InputBinding<HoldAction>, GamepadHoldBindingArgs {
    /** The action associated with this binding. */
    readonly action: HoldAction;
    /** The index of the gamepad button associated with this binding. */
    readonly buttonIndex: GamepadButtonIndex;
    /** A human-readable description of this binding. */
    readonly displayText: string;
    /** Constructs a new GamepadHoldBinding.
     * @param action - The action associated with this binding.
     * @param buttonIndex - The index of the gamepad button associated with this binding.
     */
    constructor(action: HoldAction, buttonIndex: GamepadButtonIndex);
}
