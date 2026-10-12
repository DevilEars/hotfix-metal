import { EcsSystem } from '../../ecs/ecs-system.js';
import { RenderContext } from '../../rendering/index.js';
import { CanvasEcsComponent } from '../components/canvas-component.js';
import { UiPointerSource } from '../types/ui-pointer-source.js';
/**
 * Creates a system that, per `CanvasEcsComponent`, hit-tests the pointer
 * source's position against that canvas's `UiInteractableEcsComponent`s
 * with `raycastUiCanvas` (topmost first; `blocksRaycasts`, canvas groups,
 * visibility and camera culling respected - see its doc comment).
 *
 * Writes `CanvasEcsComponent.hoveredEntity` (the topmost hit, or `null`) and
 * `isPointerOverUi` (`hoveredEntity !== null`) every tick - read by
 * `createUiInteractionEcsSystem` and by game systems wanting to gate world
 * interaction on "did this click land on the UI".
 *
 * Must be registered after `createUiLayoutEcsSystem` (it reads the rects
 * that system resolves) and before `createUiInteractionEcsSystem`.
 * @param pointerSource - The pointer source hit-tested against.
 * @param renderContext - The render context canvases' cameras render
 * through, used to convert the pointer position.
 * @returns The UI raycast ECS system.
 */
export declare const createUiRaycastEcsSystem: (pointerSource: UiPointerSource, renderContext: RenderContext) => EcsSystem<[CanvasEcsComponent]>;
