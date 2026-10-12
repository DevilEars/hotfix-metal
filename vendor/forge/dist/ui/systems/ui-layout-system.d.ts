import { PositionEcsComponent } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { RenderContext } from '../../rendering/index.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
/**
 * Creates a system that resolves every `RectTransformEcsComponent` against
 * its parent's rect, top-down, in hierarchy pre-order starting from each
 * `CanvasEcsComponent`'s root. For each element it writes the resolved
 * `RectTransformEcsComponent.rect`, the entity's `PositionEcsComponent.local`
 * (so the existing `createTransformEcsSystem` composes the correct
 * `position.world`), and, for an element with a `SpriteEcsComponent` or a
 * `MaskEcsComponent`, its `width`/`height`/`pivot`, so a mask clips to the
 * element's rect. It doesn't order anything: the render
 * system draws a UI tree in hierarchy order like any other, and the UI's
 * raycasts and navigation use that same draw order.
 *
 * A `renderMode: 'screenSpace'` canvas root's rect (and its camera's
 * `verticalWorldUnits`) is recomputed from `renderContext`'s current
 * dimensions every call, so resizing the render destination is picked up
 * automatically on the next frame with no separate resize hook - this
 * system does a full recompute every frame rather than tracking dirty
 * state, favoring correctness over the added complexity dirty-tracking a
 * retained tree would need. Its camera's `renderTarget` (see
 * `createUiCanvas`) is canvas-sized, so the render context resizes it.
 *
 * A `renderMode: 'worldSpace'` canvas root is resolved exactly like any
 * other element instead - against its own parent's rect (or, with no UI
 * parent, as an ordinary root) - and its camera is never touched, since a
 * world-space canvas typically shares the game's own world camera.
 *
 * Also computes each canvas's current reference-pixel-to-screen-pixel ratio
 * (its camera's `CameraView.pixelsPerUnit`, which follows the camera's
 * zoom, re-derived from whichever camera that canvas root just resolved) and
 * threads it down through the whole subtree, so any descendant's
 * `'screenPixels'`-unit `UiAxis` size/margin (see `UiAxisSizeUnit`) converts
 * against the ratio that's actually live for the canvas it belongs to, not
 * a stale or unrelated one.
 *
 * Must be registered before `createTransformEcsSystem`.
 * @param renderContext - The render context UI canvases resolve their root
 * rect against.
 * @returns The UI layout ECS system.
 */
export declare const createUiLayoutEcsSystem: (renderContext: RenderContext) => EcsSystem<[RectTransformEcsComponent, PositionEcsComponent]>;
