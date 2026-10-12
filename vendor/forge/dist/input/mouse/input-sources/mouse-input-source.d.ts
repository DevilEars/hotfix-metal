import { Vector2 } from '../../../math/index.js';
import { MouseButton } from '../../constants/index.js';
import { InputManager } from '../../input-manager.js';
import { Resettable, Stoppable } from '../../../common/index.js';
import { MouseAxis1dBinding, MouseAxis2dBinding, MouseHoldBinding, MouseTriggerBinding } from '../bindings/index.js';
import { Axis1dInputSource, Axis2dInputSource, HoldInputSource, TriggerInputSource } from '../../input-sources/index.js';
export declare class MouseInputSource implements TriggerInputSource<MouseTriggerBinding>, HoldInputSource<MouseHoldBinding>, Axis1dInputSource<MouseAxis1dBinding>, Axis2dInputSource<MouseAxis2dBinding>, Resettable, Stoppable {
    /** The name of this input source. */
    readonly name = "mouse";
    /** The set of trigger bindings associated with this input source. */
    readonly triggerBindings: Set<MouseTriggerBinding>;
    /** The set of 1D axis bindings associated with this input source. */
    readonly axis1dBindings: Set<MouseAxis1dBinding>;
    /** The set of 2D axis bindings associated with this input source. */
    readonly axis2dBindings: Set<MouseAxis2dBinding>;
    /** The set of hold bindings associated with this input source. */
    readonly holdBindings: Set<MouseHoldBinding>;
    private readonly _inputManager;
    private readonly _container;
    private readonly _mouseButtonPresses;
    private readonly _mouseButtonDowns;
    private readonly _mouseButtonUps;
    private readonly _pointerPosition;
    private readonly _pointerDelta;
    private readonly _pointerScroll;
    private _wheelInput;
    /** Constructs a new MouseInputSource.
     * @param inputManager - The input manager to register with.
     * @param container - The HTML container element to attach mouse events to.
     */
    constructor(inputManager: InputManager, container: HTMLElement);
    /**
     * The pointer's current position in CSS pixels: Y-down, origin at the
     * container's top-left corner. On a high-DPI display this is smaller than
     * the canvas's drawing-buffer coordinates by `RenderContext.pixelRatio`,
     * so convert it to world space against `RenderContext.cssWidth`/
     * `cssHeight`, not `width`/`height`. Recomputed from a fresh
     * `getBoundingClientRect()` call on every `mousemove`, so it stays correct
     * after the container is resized, scrolled, or otherwise reflowed.
     */
    get position(): Vector2;
    /** How far `position` moved since the last `reset()`, in CSS pixels. */
    get delta(): Vector2;
    /**
     * Accumulated wheel scroll delta since the last `reset()`, in CSS pixels:
     * `WheelEvent.deltaX`/`deltaY`, so `x` is positive scrolling right and
     * `y` positive scrolling down (Y-down, like `position`). Wheels that
     * report lines or pages are converted to pixels.
     */
    get scroll(): Vector2;
    /** Buttons that started being held down since the last `reset()`. */
    get buttonsDown(): ReadonlySet<MouseButton>;
    /** Buttons currently held down. */
    get buttonsHeld(): ReadonlySet<MouseButton>;
    /** Buttons that stopped being held down since the last `reset()`. */
    get buttonsUp(): ReadonlySet<MouseButton>;
    /**
     * Ends the frame: clears the per-frame button sets, `delta` and `scroll`,
     * and withdraws the frame's wheel input from the wheel-bound actions,
     * since a wheel turn only describes the frame it happened in.
     */
    reset(): void;
    /** Stops listening to the mouse and releases everything this source was holding. */
    stop(): void;
    private readonly _onMouseDownHandler;
    private readonly _onMouseUpHandler;
    private readonly _onWheelHandler;
    /**
     * The CSS pixels one unit of a wheel event's delta stands for: `1` for
     * pixels, {@link wheelLineHeight} for lines, and the container's size for
     * pages.
     */
    private _wheelDeltaModeScale;
    private _reportButton;
    private _reportWheel;
    private readonly _onMouseMoveHandler;
}
