import { EcsSystem } from '../../ecs/ecs-system.js';
import { CanvasEcsComponent } from '../components/canvas-component.js';
/**
 * Creates a system that drives gamepad/keyboard focus navigation, the
 * counterpart to pointer hover/click that lets a controller or keyboard
 * reach and invoke the same interactables.
 *
 * Every `interactable: true`, `focusable: true` `UiInteractableEcsComponent` - not disabled by
 * an ancestor `CanvasGroupEcsComponent` either, see `resolveCanvasGroupState`
 * - and visible in the hierarchy (see `VisibilityEcsComponent`) is
 * automatically focus-navigable: for each of a canvas's `navigateInput`
 * presses this frame (see `Axis2dAction.presses`), focus moves to the
 * nearest candidate on the same canvas in the press's dominant direction (a `UiFocusEcsComponent` on the
 * currently focused entity overrides that search on whichever sides it
 * sets). `submitInput` raises `onInvoke` on the focused element;
 * `cancelInput` clears focus - register your own listener on
 * `cancelInput.triggerEvent` for bespoke "close this menu" behavior.
 *
 * When the focused element is hidden (it or an ancestor), focus is
 * released rather than moved, so game code that focuses something else
 * itself isn't overridden; with nothing focused, the next navigation step
 * focuses the first-drawn candidate again. Losing `interactable` doesn't
 * release focus: a disabled element stays on screen, where a player can
 * still see what's focused.
 *
 * Also resets every `UiInteractableEcsComponent.wasInvokedThisFrame` to
 * `false` at the start of its tick, before re-setting it for this tick's
 * submit invocation - the single point in the pipeline responsible for that
 * reset (see `createUiInteractionEcsSystem`, which only ever sets it `true`
 * for the pointer path and relies on this system having already cleared
 * it this tick). Always register this system - even on a canvas with no
 * `submitInput`/`cancelInput`/`navigateInput` configured - or
 * `wasInvokedThisFrame` never clears; `registerUiSystems` registers it.
 *
 * Must be registered after `createUiRaycastEcsSystem` (if present) and
 * before `createUiInteractionEcsSystem`.
 * @returns The UI navigation ECS system.
 */
export declare const createUiNavigationEcsSystem: () => EcsSystem<[CanvasEcsComponent]>;
