import { Stoppable } from '../../../common/index.js';
import { KeyboardHoldBinding } from '../bindings/keyboard-hold-binding.js';
import { InputManager } from '../../input-manager.js';
import { KeyboardAxis1dBinding, KeyboardAxis2dBinding, KeyboardTriggerBinding } from '../bindings/index.js';
import { Axis1dInputSource, Axis2dInputSource, HoldInputSource, TriggerInputSource } from '../../input-sources/index.js';
/**
 * Represents a keyboard input source with associated bindings. It reports
 * the keys held to its `InputManager` whenever a key goes down or comes up.
 */
export declare class KeyboardInputSource implements TriggerInputSource<KeyboardTriggerBinding>, HoldInputSource<KeyboardHoldBinding>, Axis2dInputSource<KeyboardAxis2dBinding>, Axis1dInputSource<KeyboardAxis1dBinding>, Stoppable {
    /** The set of trigger bindings associated with this input source. */
    readonly triggerBindings: Set<KeyboardTriggerBinding>;
    /** The set of hold bindings associated with this input source. */
    readonly holdBindings: Set<KeyboardHoldBinding>;
    /** The set of axis-2d bindings associated with this input source. */
    readonly axis2dBindings: Set<KeyboardAxis2dBinding>;
    /** The set of axis-1d bindings associated with this input source. */
    readonly axis1dBindings: Set<KeyboardAxis1dBinding>;
    readonly name = "Keyboard";
    private readonly _inputManager;
    /**
     * The keys the game saw go down and hasn't seen released yet. A key typed
     * into an editable element never enters this set, and a release of a key
     * that isn't in it is ignored, so typing into an HTML text box (Forge's
     * own text fields included) never reaches the game, while a key held
     * before typing started is still released.
     */
    private readonly _keyHolds;
    /** Constructs a new KeyboardInputSource.
     * @param inputManager - The input manager to associate with this input source.
     */
    constructor(inputManager: InputManager);
    /** Stops listening to the keyboard and releases every key this source was holding. */
    stop(): void;
    private readonly _onKeyDownHandler;
    private readonly _onKeyUpHandler;
    private _reportKey;
    /**
     * Reports every hold action bound to `keyCode` as held while any of its
     * keys is, so releasing one of two keys bound to the same action doesn't
     * end the hold.
     */
    private _reportHoldBindings;
    /**
     * Reports every axis-1d action bound to `keyCode`, with its value derived
     * from which of its keys are held right now.
     */
    private _reportAxis1dBindings;
    /** Reports every axis-2d action bound to `keyCode`, see `_reportAxis1dBindings`. */
    private _reportAxis2dBindings;
    /**
     * Combines every axis-1d binding on this source that targets `action`
     * (e.g. both A/D and the arrow keys), so opposite keys cancel out and two
     * keys for the same direction don't add up past `1`.
     */
    private _readAxis1dValue;
    /** Combines every axis-2d binding on this source that targets `action`, see `_readAxis1dValue`. */
    private _readAxis2dValue;
    private _readKey;
}
