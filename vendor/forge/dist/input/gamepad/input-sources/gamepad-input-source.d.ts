import { Stoppable, Updatable } from '../../../common/index.js';
import { Axis1dInputSource, Axis2dInputSource, HoldInputSource, TriggerInputSource } from '../../input-sources/index.js';
import { InputManager } from '../../input-manager.js';
import { GamepadAxis1dBinding, GamepadAxis2dBinding, GamepadHoldBinding, GamepadTriggerBinding } from '../bindings/index.js';
/**
 * Represents a gamepad input source with associated bindings.
 *
 * Unlike `KeyboardInputSource` and `MouseInputSource`, the Gamepad API has
 * no change events, so this source must be polled every frame. It registers
 * itself with the `InputManager` as an `Updatable` to do so.
 */
export declare class GamepadInputSource implements TriggerInputSource<GamepadTriggerBinding>, HoldInputSource<GamepadHoldBinding>, Axis1dInputSource<GamepadAxis1dBinding>, Axis2dInputSource<GamepadAxis2dBinding>, Updatable, Stoppable {
    /** The name of this input source. */
    readonly name = "gamepad";
    /** The set of trigger bindings associated with this input source. */
    readonly triggerBindings: Set<GamepadTriggerBinding>;
    /** The set of hold bindings associated with this input source. */
    readonly holdBindings: Set<GamepadHoldBinding>;
    /** The set of 1D axis bindings associated with this input source. */
    readonly axis1dBindings: Set<GamepadAxis1dBinding>;
    /** The set of 2D axis bindings associated with this input source. */
    readonly axis2dBindings: Set<GamepadAxis2dBinding>;
    private readonly _inputManager;
    private readonly _gamepadIndex;
    private _gamepad;
    /** Constructs a new GamepadInputSource.
     * @param inputManager - The input manager to register with.
     * @param gamepadIndex - The index of the gamepad to read from, as reported by `navigator.getGamepads()`. Defaults to `0`, the first connected gamepad. -1 will select the last connected gamepad, which is useful for hot-plugging a single gamepad.
     */
    constructor(inputManager: InputManager, gamepadIndex?: number);
    /** Polls the gamepad and reports its current state for every binding to the `InputManager`. */
    update(): void;
    /** Unregisters this source from the `InputManager`, releasing everything it was holding. */
    stop(): void;
    private readonly _onGamepadConnected;
    private readonly _onGamepadDisconnected;
    /** Gets the gamepad by index. If the id is -1, it will get the last connected gamepad */
    private _getGamepad;
    private _getLastConnectedGamepad;
    private _updateAxis1dBindings;
    private _updateAxis2dBindings;
    private _updateHoldBindings;
    private _updateTriggerBindings;
    private _readAxis1dValue;
    private _readAxis2dValue;
}
