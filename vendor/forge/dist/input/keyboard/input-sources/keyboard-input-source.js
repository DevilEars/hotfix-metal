import { clamp } from '../../../math/index.js';
/**
 * Whether `event` was typed into an editable element: an `<input>`,
 * `<textarea>`, `<select>` or a `contentEditable` element. Reads the
 * event's composed path rather than `target`, since at the window `target`
 * is the shadow host for an element inside a shadow root.
 */
function isTypedIntoEditableElement(event) {
    const [origin] = event.composedPath();
    if (!(origin instanceof HTMLElement)) {
        return false;
    }
    return (origin instanceof HTMLInputElement ||
        origin instanceof HTMLTextAreaElement ||
        origin instanceof HTMLSelectElement ||
        origin.isContentEditable);
}
/**
 * Represents a keyboard input source with associated bindings. It reports
 * the keys held to its `InputManager` whenever a key goes down or comes up.
 */
export class KeyboardInputSource {
    /** The set of trigger bindings associated with this input source. */
    triggerBindings = new Set();
    /** The set of hold bindings associated with this input source. */
    holdBindings = new Set();
    /** The set of axis-2d bindings associated with this input source. */
    axis2dBindings = new Set();
    /** The set of axis-1d bindings associated with this input source. */
    axis1dBindings = new Set();
    name = 'Keyboard';
    _inputManager;
    /**
     * The keys the game saw go down and hasn't seen released yet. A key typed
     * into an editable element never enters this set, and a release of a key
     * that isn't in it is ignored, so typing into an HTML text box (Forge's
     * own text fields included) never reaches the game, while a key held
     * before typing started is still released.
     */
    _keyHolds = new Set();
    /** Constructs a new KeyboardInputSource.
     * @param inputManager - The input manager to associate with this input source.
     */
    constructor(inputManager) {
        this._inputManager = inputManager;
        globalThis.addEventListener('keydown', this._onKeyDownHandler);
        globalThis.addEventListener('keyup', this._onKeyUpHandler);
    }
    /** Stops listening to the keyboard and releases every key this source was holding. */
    stop() {
        globalThis.removeEventListener('keydown', this._onKeyDownHandler);
        globalThis.removeEventListener('keyup', this._onKeyUpHandler);
        this._keyHolds.clear();
        this._inputManager.removeSourceInput(this);
    }
    _onKeyDownHandler = (event) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
        if (event.repeat) {
            return;
        }
        if (isTypedIntoEditableElement(event)) {
            return;
        }
        const keyCode = event.code;
        this._keyHolds.add(keyCode);
        this._reportKey(keyCode, true);
    };
    _onKeyUpHandler = (event) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
        if (event.repeat) {
            return;
        }
        const keyCode = event.code;
        if (!this._keyHolds.has(keyCode)) {
            return;
        }
        this._keyHolds.delete(keyCode);
        this._reportKey(keyCode, false);
    };
    _reportKey(keyCode, isDown) {
        for (const binding of this.triggerBindings) {
            if (binding.keyCode === keyCode) {
                this._inputManager.setTriggerInput(this, binding, isDown);
            }
        }
        this._reportHoldBindings(keyCode);
        this._reportAxis1dBindings(keyCode);
        this._reportAxis2dBindings(keyCode);
    }
    /**
     * Reports every hold action bound to `keyCode` as held while any of its
     * keys is, so releasing one of two keys bound to the same action doesn't
     * end the hold.
     */
    _reportHoldBindings(keyCode) {
        const reportedActions = new Set();
        for (const binding of this.holdBindings) {
            if (reportedActions.has(binding.action) || binding.keyCode !== keyCode) {
                continue;
            }
            reportedActions.add(binding.action);
            let isDown = false;
            for (const other of this.holdBindings) {
                if (other.action === binding.action &&
                    this._keyHolds.has(other.keyCode)) {
                    isDown = true;
                }
            }
            this._inputManager.setHoldInput(this, binding.action, isDown);
        }
    }
    /**
     * Reports every axis-1d action bound to `keyCode`, with its value derived
     * from which of its keys are held right now.
     */
    _reportAxis1dBindings(keyCode) {
        const reportedActions = new Set();
        for (const binding of this.axis1dBindings) {
            if (reportedActions.has(binding.action) ||
                (binding.positiveKeyCode !== keyCode &&
                    binding.negativeKeyCode !== keyCode)) {
                continue;
            }
            reportedActions.add(binding.action);
            this._inputManager.setAxis1dInput(this, binding.action, this._readAxis1dValue(binding.action));
        }
    }
    /** Reports every axis-2d action bound to `keyCode`, see `_reportAxis1dBindings`. */
    _reportAxis2dBindings(keyCode) {
        const reportedActions = new Set();
        for (const binding of this.axis2dBindings) {
            if (reportedActions.has(binding.action) ||
                (binding.northKeyCode !== keyCode &&
                    binding.southKeyCode !== keyCode &&
                    binding.eastKeyCode !== keyCode &&
                    binding.westKeyCode !== keyCode)) {
                continue;
            }
            reportedActions.add(binding.action);
            const { x, y } = this._readAxis2dValue(binding.action);
            this._inputManager.setAxis2dInput(this, binding.action, x, y);
        }
    }
    /**
     * Combines every axis-1d binding on this source that targets `action`
     * (e.g. both A/D and the arrow keys), so opposite keys cancel out and two
     * keys for the same direction don't add up past `1`.
     */
    _readAxis1dValue(action) {
        let value = 0;
        for (const binding of this.axis1dBindings) {
            if (binding.action === action) {
                value +=
                    this._readKey(binding.positiveKeyCode) -
                        this._readKey(binding.negativeKeyCode);
            }
        }
        return clamp(value, -1, 1);
    }
    /** Combines every axis-2d binding on this source that targets `action`, see `_readAxis1dValue`. */
    _readAxis2dValue(action) {
        let x = 0;
        let y = 0;
        for (const binding of this.axis2dBindings) {
            if (binding.action === action) {
                x +=
                    this._readKey(binding.eastKeyCode) -
                        this._readKey(binding.westKeyCode);
                y +=
                    this._readKey(binding.northKeyCode) -
                        this._readKey(binding.southKeyCode);
            }
        }
        return { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
    }
    _readKey(keyCode) {
        return this._keyHolds.has(keyCode) ? 1 : 0;
    }
}
