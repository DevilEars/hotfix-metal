import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { RenderContext } from '../../rendering/index.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
import { UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
import { UiScrollRectEcsComponent } from '../components/ui-scroll-rect-component.js';
import { UiPointerSource } from '../types/ui-pointer-source.js';
/**
 * Creates a system that scrolls every `UiScrollRectEcsComponent`'s content.
 * Each tick, per scroll rect, in this order:
 *
 * - If focus just moved to a control inside the content by navigation (not
 *   by the pointer hovering it), scrolls just far enough to show it.
 * - While a scrollbar's track is pressed, moves the content with its handle.
 * - Otherwise, while the scroll rect's `UiInteractableEcsComponent` is
 *   dragging - including a drag that started on a control inside the
 *   content, which `createUiInteractionEcsSystem` hands to it - moves the
 *   content with the pointer, pulling elastic content past an edge with
 *   resistance.
 * - Otherwise, scrolls by the mouse wheel when the pointer is over this
 *   scroll rect and no scroll rect nested inside it, then lets released
 *   content coast and spring back inside its edges.
 *
 * An axis only scrolls when it's enabled and the content is bigger than the
 * scroll rect on it. The system then writes `offset` into the content's
 * `RectTransformEcsComponent.anchoredPosition` (it's the only writer), sizes
 * and places the scrollbar handles, and raises `onValueChanged` if `offset`
 * changed. The layout resolves the new position on the next tick, the same
 * one-frame lag `createUiSliderEcsSystem` has.
 *
 * Must be registered after `createUiInteractionEcsSystem` (it reads
 * `isDragging`, `pressCapture` and `CanvasEcsComponent.hoveredEntity`).
 * `registerUiSystems` does this for you whenever a `pointerSource` is
 * supplied.
 * @param pointerSource - The pointer source dragged against and read for
 * the wheel.
 * @param renderContext - The render context canvases' cameras render
 * through, used to convert the pointer position.
 * @param time - The time instance driving inertia and elasticity.
 * @returns The UI scroll rect ECS system.
 * @throws From `update`: an error if a scroll rect's content isn't its
 * direct child anchored at its top-left corner, or a scrollbar handle isn't
 * stretched along its scrollbar.
 */
export declare const createUiScrollRectEcsSystem: (pointerSource: UiPointerSource, renderContext: RenderContext, time: Time) => EcsSystem<[UiScrollRectEcsComponent, UiInteractableEcsComponent, RectTransformEcsComponent]>;
