import { clamp } from '../math/index.js';
import { setAxis1dActionValue, } from './actions/axis-1d-action.js';
import { clearAxis2dActionPresses, setAxis2dActionValue, } from './actions/axis-2d-action.js';
import { setHoldActionHeld } from './actions/hold-action.js';
import { clearTriggerAction, fireTriggerAction, } from './actions/trigger-action.js';
import { buttonMoments } from './constants/index.js';
/**
 * Finds the input with the largest magnitude. On a tie, `currentSource`
 * keeps driving the action, so two equally strong inputs don't swap which
 * one the action reads every time either reports.
 */
const findStrongestInput = (inputs, currentSource, measure) => {
    let strongest = null;
    let strongestMagnitude = -1;
    const currentInput = currentSource === undefined ? undefined : inputs.get(currentSource);
    if (currentSource !== undefined && currentInput !== undefined) {
        strongest = { source: currentSource, input: currentInput };
        strongestMagnitude = measure(currentInput);
    }
    for (const [source, input] of inputs) {
        const magnitude = measure(input);
        if (magnitude > strongestMagnitude) {
            strongest = { source, input };
            strongestMagnitude = magnitude;
        }
    }
    return strongest;
};
const measureAxis2dInput = ({ x, y }) => Math.hypot(x, y);
/**
 * InputManager is responsible for managing input sources, groups, and actions.
 * It is the top-level class that coordinates input handling.
 *
 * Input sources report what they're doing for each action (a key held, a
 * stick's deflection) through `setAxis1dInput`, `setAxis2dInput`,
 * `setHoldInput` and `setTriggerInput`. The manager keeps each source's
 * latest report and derives every action's state from those reports and the
 * active group. It is the only writer of action state.
 */
export class InputManager {
    _activeGroup;
    _updatables;
    _resettables;
    _triggerActions;
    _axis1dInputs;
    _axis2dInputs;
    _axisDrivers;
    _holdInputs;
    /**
     * The trigger bindings whose button is down, per source, and whether that
     * press started while the binding's group was active.
     */
    _triggerPresses;
    /** Constructs a new InputManager. */
    constructor(activeGroup = 'game') {
        this._activeGroup = activeGroup;
        this._updatables = new Set();
        this._resettables = new Set();
        this._triggerActions = new Set();
        this._axis1dInputs = new Map();
        this._axis2dInputs = new Map();
        this._axisDrivers = new Map();
        this._holdInputs = new Map();
        this._triggerPresses = new Map();
    }
    /** Gets the currently active input group, or null if none is active. */
    get activeGroup() {
        return this._activeGroup;
    }
    /** Adds new actions to the manager.
     * @param actions - The action(s) to add.
     */
    addTriggerActions(...actions) {
        for (const action of actions) {
            this._triggerActions.add(action);
        }
    }
    /**
     * Adds new 1D axis actions to the manager.
     * @param actions - The action(s) to add.
     */
    addAxis1dActions(...actions) {
        for (const action of actions) {
            if (!this._axis1dInputs.has(action)) {
                this._axis1dInputs.set(action, new Map());
            }
        }
    }
    /**
     * Adds new 2D axis actions to the manager.
     * @param actions - The action(s) to add.
     */
    addAxis2dActions(...actions) {
        for (const action of actions) {
            if (!this._axis2dInputs.has(action)) {
                this._axis2dInputs.set(action, new Map());
            }
        }
    }
    /**
     * Adds new hold actions to the manager.
     * @param actions - The action(s) to add.
     */
    addHoldActions(...actions) {
        for (const action of actions) {
            if (!this._holdInputs.has(action)) {
                this._holdInputs.set(action, {
                    down: new Set(),
                    activePresses: new Set(),
                });
            }
        }
    }
    /** Removes a trigger action from the manager, forgetting its sources' input.
     * @param action - The action to remove.
     */
    removeTriggerAction(action) {
        this._triggerActions.delete(action);
        for (const binding of this._triggerPresses.keys()) {
            if (binding.action === action) {
                this._triggerPresses.delete(binding);
            }
        }
        clearTriggerAction(action);
    }
    /** Removes a 1D axis action from the manager, forgetting its sources' input and setting it to `0`.
     * @param action - The action to remove.
     */
    removeAxis1dAction(action) {
        this._axis1dInputs.delete(action);
        this._axisDrivers.delete(action);
        setAxis1dActionValue(action, 0);
    }
    /** Removes a 2D axis action from the manager, forgetting its sources' input and setting it to `0`.
     * @param action - The action to remove.
     */
    removeAxis2dAction(action) {
        this._axis2dInputs.delete(action);
        this._axisDrivers.delete(action);
        setAxis2dActionValue(action, 0, 0);
    }
    /** Removes a hold action from the manager, forgetting its sources' input and ending its hold.
     * @param action - The action to remove.
     */
    removeHoldAction(action) {
        this._holdInputs.delete(action);
        setHoldActionHeld(action, false);
    }
    /** Gets a trigger action by name.
     * @param name - The name of the action to get.
     * @returns The TriggerAction with the specified name.
     * @throws Error if no action with the specified name is found.
     */
    getTriggerAction(name) {
        for (const action of this._triggerActions) {
            if (action.name === name) {
                return action;
            }
        }
        throw new Error(`No TriggerAction found with name: ${name}`);
    }
    /** Gets a 1D axis action by name.
     * @param name - The name of the action to get.
     * @returns The Axis1dAction with the specified name.
     * @throws Error if no action with the specified name is found.
     */
    getAxis1dAction(name) {
        for (const action of this._axis1dInputs.keys()) {
            if (action.name === name) {
                return action;
            }
        }
        throw new Error(`No Axis1dAction found with name: ${name}`);
    }
    /** Gets a 2D axis action by name.
     * @param name - The name of the action to get.
     * @returns The Axis2dAction with the specified name.
     * @throws Error if no action with the specified name is found.
     */
    getAxis2dAction(name) {
        for (const action of this._axis2dInputs.keys()) {
            if (action.name === name) {
                return action;
            }
        }
        throw new Error(`No Axis2dAction found with name: ${name}`);
    }
    /** Gets a hold action by name.
     * @param name - The name of the action to get.
     * @returns The HoldAction with the specified name.
     * @throws Error if no action with the specified name is found.
     */
    getHoldAction(name) {
        for (const action of this._holdInputs.keys()) {
            if (action.name === name) {
                return action;
            }
        }
        throw new Error(`No HoldAction found with name: ${name}`);
    }
    /**
     * Sets the active input group.
     *
     * The group being deactivated is released: its axes read `0` and its
     * holds end. The group being activated reads its sources' current input
     * straight away: its axes pick up the keys or sticks held right now. Its
     * holds don't: a hold only starts on a press made while its group is
     * active, so a button that's already down has to be released and pressed
     * again. The same goes for an up-moment trigger, which only fires on the
     * release of a press made while its group was active.
     * @param group - The name of the group to set as active, or null to clear.
     */
    setActiveGroup(group) {
        if (group === this._activeGroup) {
            return;
        }
        const previousGroup = this._activeGroup;
        this._activeGroup = group;
        if (previousGroup !== null) {
            this._forgetActivePresses(previousGroup);
            this._deriveGroup(previousGroup);
        }
        if (group !== null) {
            this._deriveGroup(group);
        }
    }
    /**
     * Records `source`'s current value for `action`. The action reads the
     * value with the largest magnitude among its sources while its group is
     * active, and `0` otherwise.
     * @param source - The source reporting the value.
     * @param action - The action the value is for.
     * @param value - The source's current value for the action.
     * @throws An error if `action` hasn't been added to this manager.
     */
    setAxis1dInput(source, action, value) {
        const inputs = this._axis1dInputs.get(action);
        if (!inputs) {
            throw new Error(this._unregisteredActionMessage('Axis1dAction', action));
        }
        // Clamped to the action's range before comparing, so an out-of-range
        // report (a fast wheel turn) doesn't outrank a fully pushed stick.
        inputs.set(source, clamp(value, -1, 1));
        this._deriveAxis1d(action, inputs);
    }
    /**
     * Records `source`'s current value for `action`. The action reads the
     * value with the largest length among its sources while its group is
     * active, and `0` otherwise.
     * @param source - The source reporting the value.
     * @param action - The action the value is for.
     * @param x - The source's current x value for the action.
     * @param y - The source's current y value for the action.
     * @throws An error if `action` hasn't been added to this manager.
     */
    setAxis2dInput(source, action, x, y) {
        const inputs = this._axis2dInputs.get(action);
        if (!inputs) {
            throw new Error(this._unregisteredActionMessage('Axis2dAction', action));
        }
        inputs.set(source, { x, y });
        this._deriveAxis2d(action, inputs);
    }
    /**
     * Records whether `source` is holding any button bound to `action`. The
     * action is held while any source holds it with a press that started
     * while the action's group was active. Reporting `true` again while
     * already down isn't a new press.
     * @param source - The source reporting its state.
     * @param action - The action the state is for.
     * @param isDown - Whether any of the source's buttons for `action` is down.
     * @throws An error if `action` hasn't been added to this manager.
     */
    setHoldInput(source, action, isDown) {
        const input = this._holdInputs.get(action);
        if (!input) {
            throw new Error(this._unregisteredActionMessage('HoldAction', action));
        }
        if (!isDown) {
            input.down.delete(source);
            input.activePresses.delete(source);
        }
        else if (!input.down.has(source)) {
            input.down.add(source);
            if (action.inputGroup === this._activeGroup) {
                input.activePresses.add(source);
            }
        }
        setHoldActionHeld(action, input.activePresses.size > 0);
    }
    /**
     * Records whether `binding`'s button is down on `source`. A down-moment
     * binding fires its action when the button goes down while the action's
     * group is active. An up-moment binding fires when the button comes up,
     * if it went down while the group was active and the group hasn't changed
     * since. Reporting the same state again does nothing, so a source may
     * report every frame.
     * @param source - The source reporting its state.
     * @param binding - The binding whose button changed.
     * @param isDown - Whether the binding's button is down.
     * @throws An error if `binding.action` hasn't been added to this manager.
     */
    setTriggerInput(source, binding, isDown) {
        const { action } = binding;
        if (!this._triggerActions.has(action)) {
            throw new Error(this._unregisteredActionMessage('TriggerAction', action));
        }
        const presses = this._triggerPresses.get(binding);
        if (isDown) {
            if (presses?.has(source)) {
                return;
            }
            const isGroupActive = action.inputGroup === this._activeGroup;
            if (presses) {
                presses.set(source, isGroupActive);
            }
            else {
                this._triggerPresses.set(binding, new Map([[source, isGroupActive]]));
            }
            if (isGroupActive && binding.moment === buttonMoments.down) {
                fireTriggerAction(action);
            }
            return;
        }
        const wasPressedWhileActive = presses?.get(source);
        presses?.delete(source);
        if (presses?.size === 0) {
            this._triggerPresses.delete(binding);
        }
        // `_forgetActivePresses` clears this flag when the group is
        // deactivated, so it being set means the group is still active.
        if (wasPressedWhileActive === true && binding.moment === buttonMoments.up) {
            fireTriggerAction(action);
        }
    }
    /**
     * Forgets everything `source` has reported, releasing whatever it was
     * holding. Sources call this when they stop, or when their device goes
     * away. No trigger fires.
     * @param source - The source whose input to forget.
     */
    removeSourceInput(source) {
        for (const [action, inputs] of this._axis1dInputs) {
            if (inputs.delete(source)) {
                this._deriveAxis1d(action, inputs);
            }
        }
        for (const [action, inputs] of this._axis2dInputs) {
            if (inputs.delete(source)) {
                this._deriveAxis2d(action, inputs);
            }
        }
        for (const [action, input] of this._holdInputs) {
            input.down.delete(source);
            input.activePresses.delete(source);
            setHoldActionHeld(action, input.activePresses.size > 0);
        }
        for (const presses of this._triggerPresses.values()) {
            presses.delete(source);
        }
    }
    /** Adds one or more updatable sources to the manager.
     * @param updatables - The updatable sources to add.
     */
    addUpdatable(...updatables) {
        for (const updatable of updatables) {
            this._updatables.add(updatable);
        }
    }
    /** Removes an updatable source from the manager.
     * @param source - The updatable source to remove.
     */
    removeUpdatable(source) {
        this._updatables.delete(source);
    }
    /** Adds one or more resettable sources to the manager.
     * @param resettables - The resettable sources to add.
     */
    addResettable(...resettables) {
        for (const resettable of resettables) {
            this._resettables.add(resettable);
        }
    }
    /** Removes a resettable source from the manager.
     * @param resettable - The resettable source to remove.
     */
    removeResettable(resettable) {
        this._resettables.delete(resettable);
    }
    /** Updates all updatable sources.
     * @param deltaTime - The time elapsed since the last update, in milliseconds.
     */
    update(deltaTime) {
        for (const updatable of this._updatables) {
            updatable.update(deltaTime);
        }
    }
    /**
     * Ends the frame: clears every trigger action's `isTriggered` and every
     * 2D axis action's `presses`, and resets every resettable source, so
     * input that only describes one frame (a mouse wheel turn) is withdrawn.
     */
    reset() {
        for (const action of this._triggerActions) {
            clearTriggerAction(action);
        }
        for (const action of this._axis2dInputs.keys()) {
            clearAxis2dActionPresses(action);
        }
        for (const resettable of this._resettables) {
            resettable.reset();
        }
    }
    /**
     * Stops presses made while `group` was active from counting once it's
     * inactive, so they don't carry over into its next activation.
     */
    _forgetActivePresses(group) {
        for (const [action, input] of this._holdInputs) {
            if (action.inputGroup === group) {
                input.activePresses.clear();
            }
        }
        for (const [binding, presses] of this._triggerPresses) {
            if (binding.action.inputGroup !== group) {
                continue;
            }
            for (const source of presses.keys()) {
                presses.set(source, false);
            }
        }
    }
    /** Re-derives the state of every axis and hold in `group`. */
    _deriveGroup(group) {
        for (const [action, inputs] of this._axis1dInputs) {
            if (action.inputGroup === group) {
                this._deriveAxis1d(action, inputs);
            }
        }
        for (const [action, inputs] of this._axis2dInputs) {
            if (action.inputGroup === group) {
                this._deriveAxis2d(action, inputs);
            }
        }
        for (const [action, input] of this._holdInputs) {
            if (action.inputGroup === group) {
                setHoldActionHeld(action, input.activePresses.size > 0);
            }
        }
    }
    _deriveAxis1d(action, inputs) {
        const strongest = this._findDriver(action, inputs, Math.abs);
        setAxis1dActionValue(action, strongest?.input ?? 0);
    }
    _deriveAxis2d(action, inputs) {
        const strongest = this._findDriver(action, inputs, measureAxis2dInput);
        setAxis2dActionValue(action, strongest?.input.x ?? 0, strongest?.input.y ?? 0);
    }
    /**
     * Finds the source driving `action`, or `null` when its group is inactive
     * or nothing reports for it.
     */
    _findDriver(action, inputs, measure) {
        if (action.inputGroup !== this._activeGroup) {
            this._axisDrivers.delete(action);
            return null;
        }
        const strongest = findStrongestInput(inputs, this._axisDrivers.get(action), measure);
        if (strongest) {
            this._axisDrivers.set(action, strongest.source);
        }
        else {
            this._axisDrivers.delete(action);
        }
        return strongest;
    }
    _unregisteredActionMessage(type, action) {
        return `Unable to set input for ${type} "${action.name}", it hasn't been added to the InputManager.`;
    }
}
