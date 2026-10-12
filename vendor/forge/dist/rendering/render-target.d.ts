import { RENDER_TARGET_FORMAT_KEYS } from './enums/index.js';
import type { RenderContext } from './render-context.js';
import type { Texture } from './texture.js';
/**
 * A render target's size: a fixed `width` x `height` in pixels, or
 * `'canvas'` - the render context's drawing buffer (`RenderContext.width` x
 * `RenderContext.height`, in device pixels), followed automatically whenever
 * the render context resizes.
 */
export type RenderTargetSize = {
    width: number;
    height: number;
} | 'canvas';
/**
 * An off-screen render destination: a framebuffer with a color texture
 * attachment. Used to render a scene (or a pass over a previous render
 * target's output) into a texture instead of directly onto the canvas.
 *
 * A full-screen pass can't sample the texture it draws into, so a
 * post-processing pass over a target needs somewhere else to write. The
 * target keeps a second color buffer for that, allocated the first time
 * `swapBuffers` runs (see `beginPostProcessPass`): each pass reads the
 * current buffer and writes the other, which then becomes current. Targets
 * that are never post-processed never allocate it.
 *
 * A target is either canvas-sized or fixed-size (see `RenderTargetSize`). A
 * canvas-sized target - what a camera that covers the canvas renders into -
 * is resized by its render context whenever the canvas is, so it never
 * needs resizing by hand and `resize` throws for it. A fixed-size target
 * (a minimap, a render-to-texture with its own resolution, an effect's
 * downsampled scratch buffer) keeps its size until `resize` is called.
 *
 * When a lost WebGL context is restored, the render context recreates the
 * target's framebuffers and color textures at its current size and format,
 * empty: the next frame draws into them again.
 */
export declare class RenderTarget {
    /**
     * The color texture's storage format, resolved once at construction. See
     * `RENDER_TARGET_FORMAT`.
     */
    readonly format: RENDER_TARGET_FORMAT_KEYS;
    private readonly _renderContext;
    private readonly _isCanvasSized;
    private readonly _followCanvas;
    private readonly _rebuild;
    private _width;
    private _height;
    private _current;
    private _other;
    /**
     * Creates a new RenderTarget.
     * @param renderContext - The render context the target belongs to.
     * @param size - The target's size: `'canvas'` to follow the render
     * context's drawing buffer, or a fixed `{ width, height }` in pixels.
     * @param format - The requested color storage format. Defaults to
     * `RENDER_TARGET_FORMAT.ldr`. `RENDER_TARGET_FORMAT.hdr` falls back to
     * `ldr` if the context lacks `EXT_color_buffer_float` (see
     * `resolveRenderTargetFormat`).
     * @throws An error if a fixed size isn't positive, or if the framebuffer
     * is not complete after attaching the color texture.
     */
    constructor(renderContext: RenderContext, size: RenderTargetSize, format?: RENDER_TARGET_FORMAT_KEYS);
    /**
     * The render target width in pixels. A canvas-sized target's width is
     * always its render context's `width`.
     */
    get width(): number;
    /**
     * The render target height in pixels. A canvas-sized target's height is
     * always its render context's `height`.
     */
    get height(): number;
    /**
     * The framebuffer of the current color buffer: the one that binding this
     * target draws into, and that `colorTexture` is attached to. Changes when
     * `swapBuffers` runs. `null` for a target created while the WebGL context
     * is lost, until the context is restored.
     */
    get framebuffer(): WebGLFramebuffer | null;
    /**
     * The current color texture, holding this target's latest contents for
     * later passes to read. Changes when `swapBuffers` runs (every
     * post-processing pass over this target) or the target is resized, so
     * read it when drawing rather than keeping it from an earlier frame. The
     * texture belongs to the render target: sample it, but don't update or
     * dispose it.
     */
    get colorTexture(): Texture;
    /**
     * Makes the other color buffer current, allocating it on first use at
     * this target's size and format, and returns the previously current color
     * texture. The new current buffer still holds whatever was last drawn into
     * it, so the caller must replace every pixel of it.
     *
     * Effects call `beginPostProcessPass` instead, which swaps, binds and
     * clears the new current buffer and turns blending off in one step;
     * swapping without doing all of that leaves stale pixels in the target.
     * @returns The color texture that was current before the swap, holding
     * this target's latest contents.
     * @throws An error if the second buffer's framebuffer is not complete.
     */
    swapBuffers(): Texture;
    /**
     * Resizes a fixed-size render target, recreating its color textures at
     * the new dimensions. A canvas-sized target follows its render context
     * instead, so it can't be resized directly.
     * @param width - The new render target width in pixels.
     * @param height - The new render target height in pixels.
     * @throws An error if the target is canvas-sized, if either dimension
     * isn't positive, or if the framebuffer is not complete after reattaching
     * a color texture.
     */
    resize(width: number, height: number): void;
    /**
     * Deletes the framebuffers and color textures, freeing their GPU
     * resources, and stops a canvas-sized target following its render
     * context. The render context holds on to every target until it's
     * disposed (to resize it with the canvas, and to rebuild it after a lost
     * WebGL context is restored), so dispose a target you stop using.
     */
    dispose(): void;
    private _reallocate;
    private _createColorBuffer;
    private _createFramebuffer;
    private _resizeColorBuffer;
    private _disposeColorBuffer;
    private _attachColorTexture;
}
/**
 * Creates a new RenderTarget.
 * @param renderContext - The render context the target belongs to.
 * @param size - The target's size: `'canvas'` for a target that covers the
 * canvas (a camera's target, presented over the whole screen), which the
 * render context resizes along with the canvas; or a fixed
 * `{ width, height }` in pixels, which only changes when you call
 * `RenderTarget.resize`.
 * @param format - The requested color storage format. Defaults to
 * `RENDER_TARGET_FORMAT.ldr`.
 * @returns The created render target.
 */
export declare function createRenderTarget(renderContext: RenderContext, size: RenderTargetSize, format?: RENDER_TARGET_FORMAT_KEYS): RenderTarget;
