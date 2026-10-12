import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/index.js';
import { RenderContext } from '../../rendering/index.js';
/**
 * Finds the topmost `UiInteractableEcsComponent` on `canvasEntity`'s canvas
 * under a pointer position: the canvas's interactables are scanned in
 * reverse draw order (drawn on top first, see `sortByDrawOrder`), for the
 * first whose resolved `rect` contains the position - a linear scan: element
 * counts here are in the hundreds, not the hundreds of thousands, so a
 * plain scan is a few microseconds with no acceleration structure to build
 * or invalidate. An element with `blocksRaycasts: false` is transparent to
 * the scan (never considered, hit or not) - so is one with an ancestor
 * `CanvasGroupEcsComponent` whose own `blocksRaycasts` is `false` (see
 * `resolveCanvasGroupState`), and so is one hidden in the hierarchy (see
 * `VisibilityEcsComponent`); an element culled from the canvas's camera
 * by `cullingMask` is skipped the same way an invisible element shouldn't
 * be clickable, and so is the part of an element a rect
 * `MaskEcsComponent` on it or an ancestor clips away.
 *
 * `createUiRaycastEcsSystem` calls this once per canvas per tick. It's a
 * plain function so code that has to react inside a DOM event handler
 * (e.g. `createUiTextInputEcsSystem` focusing a text field during a tap, so
 * a phone opens its keyboard) gets the same answer, occlusion included.
 * Reads the rects `createUiLayoutEcsSystem` resolved on the last tick.
 * @param world - The ECS world the canvas belongs to.
 * @param canvasEntity - The canvas entity to hit-test.
 * @param renderContext - The render context the canvas's camera renders
 * through, used to convert the pointer position.
 * @param viewportPosition - The pointer position, in CSS pixels from the
 * canvas's top-left corner, Y-down.
 * @returns The topmost hit entity, or `null` if nothing was hit (or the
 * canvas's camera can't convert the position).
 */
export declare function raycastUiCanvas(world: EcsWorld, canvasEntity: number, renderContext: RenderContext, viewportPosition: Vector2): number | null;
