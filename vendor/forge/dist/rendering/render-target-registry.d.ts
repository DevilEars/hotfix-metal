import type { RenderContext } from './render-context.js';
/**
 * Reallocates a canvas-sized render target at its render context's current
 * drawing-buffer size.
 */
type FollowCanvas = () => void;
/**
 * Registers a canvas-sized render target with its render context, so
 * `resizeCanvasSizedRenderTargets` resizes it.
 * @param renderContext - The render context the target belongs to.
 * @param followCanvas - Reallocates the target at `renderContext`'s size.
 */
export declare function registerCanvasSizedRenderTarget(renderContext: RenderContext, followCanvas: FollowCanvas): void;
/**
 * Stops `resizeCanvasSizedRenderTargets` resizing a render target. Does
 * nothing for a target that was never registered.
 * @param renderContext - The render context the target belongs to.
 * @param followCanvas - The callback the target registered with.
 */
export declare function unregisterCanvasSizedRenderTarget(renderContext: RenderContext, followCanvas: FollowCanvas): void;
/**
 * Resizes every canvas-sized render target registered with `renderContext`
 * to its current drawing-buffer size.
 * @param renderContext - The render context that was just resized.
 */
export declare function resizeCanvasSizedRenderTargets(renderContext: RenderContext): void;
export {};
