import { RENDER_TARGET_FORMAT_KEYS } from './enums/index.js';
import type { RenderContext } from './render-context.js';
import { RenderTarget, RenderTargetSize } from './render-target.js';
/**
 * A pair of render targets that can be flipped between a "read" and a
 * "write" target, for passes that repeatedly sample the previous pass's
 * output while writing into a separate buffer (e.g. multi-step
 * post-processing effects).
 */
export declare class PingPongTarget {
    private readonly _targets;
    private _readIndex;
    /**
     * Creates a new PingPongTarget, allocating two render targets of the given size.
     * @param renderContext - The render context both targets belong to.
     * @param size - Both targets' size: `'canvas'` to follow the render
     * context's drawing buffer, or a fixed `{ width, height }` in pixels (see
     * `createRenderTarget`).
     * @param format - The requested color storage format for both underlying
     * render targets. Defaults to `RENDER_TARGET_FORMAT.ldr`.
     */
    constructor(renderContext: RenderContext, size: RenderTargetSize, format?: RENDER_TARGET_FORMAT_KEYS);
    /**
     * The render target that should be sampled from by the current pass.
     */
    get read(): RenderTarget;
    /**
     * The render target that the current pass should write into.
     */
    get write(): RenderTarget;
    /**
     * Flips the read and write targets, so the target just written to becomes
     * the target the next pass reads from.
     */
    swap(): void;
    /**
     * Resizes both render targets, if they're fixed-size (see
     * `RenderTarget.resize`).
     * @param width - The new render target width in pixels.
     * @param height - The new render target height in pixels.
     * @throws An error if the targets are canvas-sized, or either dimension
     * isn't positive.
     */
    resize(width: number, height: number): void;
    /**
     * Deletes both render targets, freeing their GPU resources.
     */
    dispose(): void;
}
