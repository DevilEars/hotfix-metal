import { EcsSystem } from '../../ecs/ecs-system.js';
import { RenderContext } from '../../rendering/index.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
import { UiSliderEcsComponent } from '../components/ui-slider-component.js';
import { UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
import { UiPointerSource } from '../types/ui-pointer-source.js';
/**
 * Creates a system that turns a drag on a `UiSliderEcsComponent`'s track
 * into a value: while the track's `UiInteractableEcsComponent` has an active
 * press (`pressCapture !== null`, so a drag that strays outside the track's
 * vertical bounds keeps tracking, and a plain click - not just a drag past
 * `dragThreshold` - jumps the handle to the click position), the pointer's
 * horizontal position within the track's resolved rect is normalized to
 * `[0, 1]` and denormalized back into `[minValue, maxValue]` (rounded when
 * `wholeNumbers` is set). Every tick, regardless of dragging, also re-derives
 * the handle's rect transform anchor (and, if there's a fill, the amount of
 * its linear `MaskEcsComponent`, which this system is the only writer of)
 * from the current `value`, so an external `slider.value =` write is
 * reflected the same way a drag is.
 *
 * Because `createUiLayoutEcsSystem` runs before the interaction pipeline
 * each tick (it must, so raycasting has this tick's resolved rects to test
 * against), a value change here - from a drag or an external write - is
 * only picked up by layout on the *next* tick, one frame later; imperceptible
 * at normal frame rates, and the same lag `createUiTransitionEcsSystem`
 * already has relative to the interaction state it eases from.
 *
 * Must be registered after `createUiInteractionEcsSystem` (it reads
 * `pressCapture`, which that system writes). `registerUiSystems` registers
 * it whenever a `pointerSource` is supplied.
 * @param pointerSource - The pointer source dragged against.
 * @param renderContext - The render context canvases' cameras render
 * through, used to convert the pointer position.
 * @returns The UI slider ECS system.
 * @throws From `update`: an error if a slider's fill has no linear or
 * radial mask.
 */
export declare const createUiSliderEcsSystem: (pointerSource: UiPointerSource, renderContext: RenderContext) => EcsSystem<[UiSliderEcsComponent, UiInteractableEcsComponent, RectTransformEcsComponent]>;
