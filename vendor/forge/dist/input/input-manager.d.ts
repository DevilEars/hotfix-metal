import { Resettable, Updatable } from '../common/index.js';
import { Axis1dAction } from './actions/axis-1d-action.js';
import { Axis2dAction } from './actions/axis-2d-action.js';
import { HoldAction } from './actions/hold-action.js';
import { TriggerAction } from './actions/trigger-action.js';
import { InputSource } from './input-source.js';
import { TriggerInputBinding } from './trigger-input-binding.js';
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
export declare class InputManager implements Updatable {
    private _activeGroup;
    private readonly _updatables;
    private readonly _resettables;
    private readonly _triggerActions;
    private readonly _axis1dInputs;
    private readonly _axis2dInputs;
    private readonly _axisDrivers;
    private readonly _holdInputs;
    /**
     * The trigger bindings whose button is down, per source, and whether that
     * press started while the binding's group was active.
     */
    private readonly _triggerPresses;
    /** Constructs a new InputManager. */
    constructor(activeGroup?: string);
    /** Gets the currently active input group, or null if none is active. */
    get activeGroup(): string | null;
    /** Adds new actions to the manager.
     * @param actions - The action(s) to add.
     */
    addTriggerActions(...actions: TriggerAction[]): void;
    /**
     * Adds new 1D axis actions to the manager.
     * @param actions - The action(s) to add.
     */
    addAxis1dActions(...actions: Axis1dAction[]): void;
    /**
     * Adds new 2D axis actions to the manager.
     * @param actions - The action(s) to add.
     */
    addAxis2dActions(...actions: Axis2dAction[]): void;
    /**
     * Adds new hold actions to the manager.
     * @param actions - The action(s) to add.
     */
    addHoldActions(...actions: HoldAction[]): void;
    /** Removes a trigger action from the manager, forgetting its sources' input.
     * @param action - The action to remove.
     */
    removeTriggerAction(action: TriggerAction): void;
    /** Removes a 1D axis action from the manager, forgetting its sources' input and setting it to `0`.
     * @param action - The action to remove.
     */
    removeAxis1dAction(action: Axis1dAction): void;
    /** Removes a 2D axis action from the manager, forgetting its sources' input and setting it to `0`.
     * @param action - The action to remove.
     */
    removeAxis2dAction(action: Axis2dAction): void;
    /** Removes a hold action from the manager, forgetting its sources' input and ending its hold.
     * @param action - The action to remove.
     */
    removeHoldAction(action: HoldAction): void;
    /** Gets a trigger action by name.
     * @param name - The name of the action to get.
     * @returns The TriggerAction with the specified name.
     * @throws Error if no action with the specified name is found.
     */
    getTriggerAction(name: string): TriggerAction;
    /** Gets a 1D axis action by name.
     * @param name - The name of the action to get.
     * @returns The Axis1dAction with the specified name.
     * @throws Error if no action with the specified name is found.
     */
    getAxis1dAction(name: string): Axis1dAction;
    /** Gets a 2D axis action by name.
     * @param name - The name of the action to get.
     * @returns The Axis2dAction with the specified name.
     * @throws Error if no action with the specified name is found.
     */
    getAxis2dAction(name: string): Axis2dAction;
    /** Gets a hold action by name.
     * @param name - The name of the action to get.
     * @returns The HoldAction with the specified name.
     * @throws Error if no action with the specified name is found.
     */
    getHoldAction(name: string): HoldAction;
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
    setActiveGroup(group: string | null): void;
    /**
     * Records `source`'s current value for `action`. The action reads the
     * value with the largest magnitude among its sources while its group is
     * active, and `0` otherwise.
     * @param source - The source reporting the value.
     * @param action - The action the value is for.
     * @param value - The source's current value for the action.
     * @throws An error if `action` hasn't been added to this manager.
     */
    setAxis1dInput(source: InputSource, action: Axis1dAction, value: number): void;
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
    setAxis2dInput(source: InputSource, action: Axis2dAction, x: number, y: number): void;
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
    setHoldInput(source: InputSource, action: HoldAction, isDown: boolean): void;
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
    setTriggerInput(source: InputSource, binding: TriggerInputBinding, isDown: boolean): void;
    /**
     * Forgets everything `source` has reported, releasing whatever it was
     * holding. Sources call this when they stop, or when their device goes
     * away. No trigger fires.
     * @param source - The source whose input to forget.
     */
    removeSourceInput(source: InputSource): void;
    /** Adds one or more updatable sources to the manager.
     * @param updatables - The updatable sources to add.
     */
    addUpdatable(...updatables: Updatable[]): void;
    /** Removes an updatable source from the manager.
     * @param source - The updatable source to remove.
     */
    removeUpdatable(source: Updatable): void;
    /** Adds one or more resettable sources to the manager.
     * @param resettables - The resettable sources to add.
     */
    addResettable(...resettables: Resettable[]): void;
    /** Removes a resettable source from the manager.
     * @param resettable - The resettable source to remove.
     */
    removeResettable(resettable: Resettable): void;
    /** Updates all updatable sources.
     * @param deltaTime - The time elapsed since the last update, in milliseconds.
     */
    update(deltaTime: number): void;
    /**
     * Ends the frame: clears every trigger action's `isTriggered` and every
     * 2D axis action's `presses`, and resets every resettable source, so
     * input that only describes one frame (a mouse wheel turn) is withdrawn.
     */
    reset(): void;
    /**
     * Stops presses made while `group` was active from counting once it's
     * inactive, so they don't carry over into its next activation.
     */
    private _forgetActivePresses;
    /** Re-derives the state of every axis and hold in `group`. */
    private _deriveGroup;
    private _deriveAxis1d;
    private _deriveAxis2d;
    /**
     * Finds the source driving `action`, or `null` when its group is inactive
     * or nothing reports for it.
     */
    private _findDriver;
    private _unregisteredActionMessage;
}
