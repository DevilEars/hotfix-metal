import { Rect } from '../../math/index.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
/**
 * Resolves a `RectTransformEcsComponent`'s rect against its parent's
 * already-resolved rect. Pure - takes no `EcsWorld`/entity, reads no other
 * state - so the entire anchor/pivot/stretch surface is unit-testable in
 * isolation.
 *
 * `x` and `y` are resolved independently by {@link resolveAxis}, since each
 * is its own `UiPointAxis` (literal size, moves with the anchor) or
 * `UiStretchAxis` (resizes with the parent, `margin` added to the anchored
 * span) - a mixed anchor (e.g. `UiAnchor.stretchTop`, stretched
 * horizontally but point-anchored vertically) simply resolves each axis
 * under its own rule.
 * @param parentRect - The parent's already-resolved rect, in UI world space.
 * @param rectTransform - The rect transform to resolve.
 * @param pixelsPerUnit - The owning canvas's live reference-pixel-to-screen-pixel
 * ratio (see `CameraView.pixelsPerUnit`), used to convert a `'screenPixels'`-unit
 * `size`/`margin` (see {@link UiAxisSizeUnit}) into reference pixels. Defaults
 * to `1` - a neutral value under which `'screenPixels'` behaves exactly like
 * `'referencePixels'` - for callers that don't track a live ratio.
 * @returns The resolved rect, in the same UI world space as `parentRect`.
 */
export declare function resolveRect(parentRect: Rect, rectTransform: RectTransformEcsComponent, pixelsPerUnit?: number): Rect;
