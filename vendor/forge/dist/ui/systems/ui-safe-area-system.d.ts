import { EcsSystem } from '../../ecs/ecs-system.js';
import { RenderContext, SafeAreaInsets } from '../../rendering/index.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
import { UiSafeAreaEcsComponent } from '../components/ui-safe-area-component.js';
/**
 * Creates a system that keeps every `UiSafeAreaEcsComponent` element's rect
 * clear of the live safe-area insets (see `getSafeAreaInsets`), converted
 * from CSS pixels into that element's canvas's own UI world units via its
 * camera's `CameraView.pixelsPerUnit` (the same view
 * `resolveCanvasPointerPosition` converts through) - so the inset shrinks the rect by a consistent visual amount
 * regardless of the canvas's `scaleMode`/reference resolution. Assumes the
 * render destination fills the browser viewport, the same assumption
 * `getSafeAreaInsets` itself is only meaningful under.
 *
 * Rewrites the element's `x`/`y` (to a full stretch, `pivot: 0`, with
 * `margin` shrinking it by the inset on each enabled edge) and
 * `anchoredPosition` (offsetting it by the left/bottom insets) every frame
 * - `RectTransformEcsComponent`'s existing anchor/pivot/margin formula
 * already expresses independent per-edge insets exactly, so no new layout
 * math was needed. An entity anchored any other way than
 * `UiAnchor.stretchAll()` is overwritten into one, since a per-edge inset
 * only means something against a full parent span.
 *
 * Must be registered before `createUiLayoutEcsSystem` (which reads the
 * `x`/`y`/`anchoredPosition` this system writes).
 * @param renderContext - The render context canvases resolve their
 * pixels-per-unit against.
 * @param getSafeAreaInsets - Returns the current safe-area insets, in CSS
 * pixels - `getSafeAreaInsets` from `@forge-game-engine/forge/rendering`
 * satisfies this directly.
 * @returns The UI safe-area ECS system.
 */
export declare const createUiSafeAreaEcsSystem: (renderContext: RenderContext, getSafeAreaInsets: () => SafeAreaInsets) => EcsSystem<[UiSafeAreaEcsComponent, RectTransformEcsComponent]>;
