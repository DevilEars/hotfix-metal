import { EcsSystem } from '../../ecs/ecs-system.js';
import { RenderContext } from '../../rendering/index.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
import { UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
import { UiPointerSource } from '../types/ui-pointer-source.js';
/**
 * Creates a system that runs the pointer interaction state machine over
 * every `UiInteractableEcsComponent`: hover enter/exit, a captured press
 * (from a pointer-down edge on the element until its matching up edge,
 * regardless of whether the pointer stays over it), drag start/move/end
 * once the press exceeds `dragThreshold`, and `onInvoke` on a release
 * inside that didn't turn into a drag.
 *
 * State is derived fresh from each tick's facts (this tick's raycast hit,
 * this tick's button edges) rather than advanced one transition at a time,
 * so a pointer enter-and-press or press-and-release landing in the same
 * tick - which a real pointer source can genuinely report, since edges are
 * only ever sampled once per tick - still resolves correctly instead of
 * silently dropping the click: an enter-and-press tick raises both
 * `onPointerEnter` and `onPointerDown` and goes straight to a captured
 * press without ever being observed as merely hovered, and a
 * press-and-release tick still raises `onInvoke` because the down and up
 * edges are read from separate per-tick sets rather than a single
 * "is held" flag that a same-tick press-then-release would never show as
 * true.
 *
 * A press that crosses `dragThreshold` is handed to the nearest element,
 * the pressed one or an ancestor, with `receivesDrag` (see
 * `UiInteractableEcsComponent.receivesDrag`): that element drags, and the
 * pressed one's press ends without `onInvoke`.
 *
 * Also applies the canvas policy that the pointer hovering an interactable
 * focuses it too (via `setUiFocus`), so the focus highlight follows the
 * mouse the same way it follows gamepad navigation.
 *
 * An element whose own `interactable` is `true` but sits under a
 * `CanvasGroupEcsComponent` ancestor with `interactable: false` cannot
 * begin a new press or gain focus by hover - see `resolveCanvasGroupState`
 * - the same way it couldn't if `interactable` were `false` on the element
 * itself.
 *
 * An element hidden in the hierarchy (see `VisibilityEcsComponent`) is
 * never hit, so the pointer exits it, and a press it captured before it
 * was hidden is cancelled (`onEndDrag` if it was dragging, then
 * `onPointerUp`, without `onInvoke`), so a slider stops following the
 * pointer. Losing `interactable` mid-press doesn't cancel the press: the
 * element is still on screen, and the release resolves as usual.
 *
 * Must be registered after `createUiRaycastEcsSystem` (it reads
 * `CanvasEcsComponent.hoveredEntity`).
 * @param pointerSource - The pointer source driving this state machine.
 * @param renderContext - The render context canvases' cameras render
 * through, used to convert the pointer position for drag-threshold checks.
 * @returns The UI interaction ECS system.
 */
export declare const createUiInteractionEcsSystem: (pointerSource: UiPointerSource, renderContext: RenderContext) => EcsSystem<[UiInteractableEcsComponent, RectTransformEcsComponent]>;
