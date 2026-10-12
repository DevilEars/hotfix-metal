import { HoldAction } from '../../actions/index.js';
import { MouseButton } from '../../constants/index.js';
import { InputBinding } from '../../input-binding.js';
/** Arguments for constructing a MouseHoldBinding. */
export interface MouseHoldBindingArgs {
    /** The mouse button associated with this binding. */
    mouseButton: MouseButton;
}
/** Mouse hold input binding. */
export declare class MouseHoldBinding implements InputBinding<HoldAction>, MouseHoldBindingArgs {
    /** The action associated with this binding. */
    readonly action: HoldAction;
    /** The mouse button associated with this binding. */
    readonly mouseButton: MouseButton;
    /** A human-readable description of this binding. */
    readonly displayText: string;
    /** Constructs a new MouseHoldBinding.
     * @param action - The action associated with this binding.
     * @param mouseButton - The mouse button associated with this binding.
     */
    constructor(action: HoldAction, mouseButton: MouseButton);
}
