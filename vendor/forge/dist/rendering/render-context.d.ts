import { ImageCache } from '../asset-loading/index.js';
import { Resizable } from '../common/index.js';
import { ForgeEvent } from '../events/index.js';
import { Color } from './color.js';
import { CLEAR_STRATEGY_KEYS } from './enums/index.js';
import type { Geometry } from './geometry/geometry.js';
import { ShaderProgram } from './materials/shader-program.js';
import { SpriteMaterial } from './materials/sprite-material.js';
import { UniformValue } from './materials/uniform-value.js';
import { RenderTarget } from './render-target.js';
import type { ForgeShaderSource } from './shaders/pre-processing/forge-shader-source.js';
import { ShaderCache } from './shaders/pre-processing/dependency-resolution/shader-cache.js';
import type { Texture } from './texture.js';
import { TextureCache } from './texture-cache.js';
/**
 * The rendering context.
 */
export declare class RenderContext implements Resizable {
    /**
     * Whether `clear` clears the bound destination. `CLEAR_STRATEGY.blank`
     * (the default) clears it; `CLEAR_STRATEGY.none` makes `clear` do
     * nothing, so cameras and full-screen passes draw over what the
     * destination already holds.
     */
    clearStrategy: CLEAR_STRATEGY_KEYS;
    /**
     * The shader store containing compiled shaders.
     */
    readonly shaderCache: ShaderCache;
    /**
     * The image cache containing loaded images.
     */
    readonly imageCache: ImageCache;
    /**
     * The texture cache, which loads each image file into a texture once so
     * sprites drawn from the same file share a texture. Its images load
     * through `imageCache`.
     */
    readonly textureCache: TextureCache;
    /** The canvas element associated with the render context. */
    readonly canvas: HTMLCanvasElement;
    /** The WebGL2 rendering context. */
    readonly gl: WebGL2RenderingContext;
    /**
     * Raised when the browser takes the WebGL context away (after a GPU
     * reset, or when the device runs low on memory), once
     * {@link RenderContext.isContextLost} is `true`. Nothing is drawn until
     * the context is restored, but the game keeps running, and creating
     * materials, textures, render targets and geometry keeps working. A game
     * that wants to recover with cheaper settings lowers them here (e.g.
     * {@link RenderContext.maxPixelRatio}).
     */
    readonly onContextLost: ForgeEvent;
    /**
     * Raised once the WebGL context is back and every GPU resource the
     * engine created (programs, textures, render targets, geometry) has been
     * rebuilt, and {@link RenderContext.isContextLost} is `false` again. The
     * next frame draws normally. A game that created raw WebGL objects of its
     * own recreates them here.
     */
    readonly onContextRestored: ForgeEvent;
    private readonly _globalUniformValues;
    private readonly _shaderPrograms;
    private _instanceBuffer;
    private _supportsHdrRenderTargets;
    private _isContextLost;
    private _whiteTexture;
    private _blackTexture;
    private _quadGeometry;
    private _spriteMaterial;
    private _width;
    private _height;
    private _cssWidth;
    private _cssHeight;
    private _pixelRatio;
    private _maxPixelRatio;
    private _devicePixelRatio;
    /**
     * Constructs a new instance of the `RenderContext` class.
     * @param shaderCache - The shader cache.
     * @param imageCache - The image cache.
     * @param canvas - The canvas element.
     * @param clearStrategy - The strategy for clearing the render context (default: CLEAR_STRATEGY.blank).
     * @param preserveDrawingBuffer - Whether to retain the drawing buffer after presentation instead of letting the browser clear it, required for reading back the canvas's pixels (e.g. `toDataURL`, `drawImage`) after a frame has already been presented (default: false, since most consumers never read the canvas back and the retained buffer costs GPU memory bandwidth).
     * @param maxPixelRatio - The highest `pixelRatio` to render at (default: no limit). See `maxPixelRatio`.
     * @remarks The canvas's current on-page size (or, if it hasn't been laid out yet, its `width`/`height` attributes - the size an unstyled canvas is shown at) is taken as its CSS size. Its CSS size is then pinned via `style.width`/`style.height` and its drawing buffer is resized to that times the display's current `devicePixelRatio` (clamped to `maxPixelRatio`), so it renders at native resolution from the first frame.
     * @throws An error if `maxPixelRatio` is not a positive number.
     */
    constructor(shaderCache: ShaderCache, imageCache: ImageCache, canvas: HTMLCanvasElement, clearStrategy?: CLEAR_STRATEGY_KEYS, preserveDrawingBuffer?: boolean, maxPixelRatio?: number);
    /**
     * Whether the WebGL context is lost: `true` from the moment the browser
     * takes it away until the engine has rebuilt its GPU resources after the
     * browser gives it back (just before `onContextRestored` is raised).
     *
     * While it's lost nothing is drawn, and creating or resizing a material,
     * texture, render target or geometry records what to create and touches
     * no WebGL state; the restore creates it.
     */
    get isContextLost(): boolean;
    /**
     * Whether render targets can store HDR (half-float) color, which needs
     * the `EXT_color_buffer_float` extension. A render target that asks for
     * `RENDER_TARGET_FORMAT.hdr` without it falls back to `ldr`.
     */
    get supportsHdrRenderTargets(): boolean;
    /**
     * The buffer the render system streams each batch's per-instance data
     * into. Owned by the render context, and recreated when a lost context is
     * restored, so read it when drawing rather than keeping it.
     */
    get instanceBuffer(): WebGLBuffer;
    /**
     * A quad covering clip space (`-1` to `1`) with texture coordinates from
     * `0` to `1`, as `a_position` and `a_texCoord`: what every sprite instance
     * and every full-screen pass is drawn from. Owned by the render context.
     */
    get quadGeometry(): Geometry;
    /**
     * The drawing buffer's width - the canvas's backing store, i.e. the
     * resolution everything is actually rendered at - in device pixels:
     * `cssWidth * pixelRatio`, rounded. This is the size the WebGL viewport
     * uses, so size anything that's rendered into and then shown on the canvas
     * (a shader uniform compared against `gl_FragCoord`) from this, not from
     * `cssWidth`. A render target that covers the canvas is created
     * canvas-sized instead (see `createRenderTarget`), so it follows this
     * size by itself. Changed only by `resize`.
     */
    get width(): number;
    /**
     * The drawing buffer's height, in device pixels. See `width`.
     */
    get height(): number;
    /**
     * The canvas's on-page (layout) width, in CSS pixels. DOM measurements -
     * `MouseInputSource.position`, `getSafeAreaInsets()` - are in CSS pixels,
     * so convert them against `cssWidth`/`cssHeight` rather than
     * `width`/`height`, which are larger by `pixelRatio`. Changed only by
     * `resize`.
     */
    get cssWidth(): number;
    /**
     * The canvas's on-page (layout) height, in CSS pixels. See `cssWidth`.
     */
    get cssHeight(): number;
    /**
     * How many drawing-buffer (device) pixels the canvas currently has per CSS
     * pixel: the display's `devicePixelRatio` as of the last resize, clamped to
     * `maxPixelRatio`. `2` on a typical HiDPI/Retina display, so the canvas
     * renders at the display's native resolution instead of being upscaled
     * (and blurred) by the browser. Changed only by `resize` (which setting
     * `maxPixelRatio` calls).
     */
    get pixelRatio(): number;
    /**
     * The highest `pixelRatio` this render context will use, however dense
     * the display is (default: no limit). Rendering cost grows with the
     * square of the pixel ratio, so a fill-rate-heavy game can cap it (e.g. at
     * `2` for 3x phone displays, or at `1` to always render at CSS
     * resolution), and change it at runtime, as a graphics-quality setting or
     * from its own frame-time measurements.
     *
     * Setting it re-applies the last `resize` at the new cap, against the
     * display's device pixel ratio as of that resize, so the canvas and every
     * canvas-sized render target re-render at the new resolution from the
     * next frame. While the canvas has no size (e.g. its container is hidden)
     * the cap is only remembered, and applies on the next `resize`.
     * @throws An error if set to anything but a positive number.
     */
    get maxPixelRatio(): number;
    set maxPixelRatio(value: number);
    /**
     * Resizes the canvas to `cssWidth` x `cssHeight` CSS pixels on the page,
     * with a drawing buffer of that size times `devicePixelRatio` (clamped to
     * `maxPixelRatio`), updates the WebGL viewport to match, and resizes every
     * canvas-sized render target (see `createRenderTarget`), so none is ever
     * out of step with the canvas for a frame.
     *
     * Does nothing if neither the CSS size nor the resulting drawing-buffer
     * size would change - assigning a canvas's `width`/`height` clears its
     * contents even when the value is the same, so repeated calls with an
     * unchanged size are safe.
     * @param cssWidth - The new on-page width, in CSS pixels.
     * @param cssHeight - The new on-page height, in CSS pixels.
     * @param devicePixelRatio - Device pixels per CSS pixel on the display the canvas is shown on (default: the browser's current `window.devicePixelRatio`). Remembered, so setting `maxPixelRatio` later re-applies it.
     * @throws An error if any argument is not a positive number.
     */
    resize(cssWidth: number, cssHeight: number, devicePixelRatio?: number): void;
    /**
     * Binds a render target as the current draw destination, or the default
     * framebuffer (the canvas) if `null` is passed. Updates the viewport to
     * match the bound target's dimensions.
     * @param target - The render target to bind, or `null` to bind the canvas.
     */
    bindRenderTarget(target: RenderTarget | null): void;
    /**
     * Clears the currently bound framebuffer's color buffer, according to `clearStrategy`.
     * @param color - The (straight, non-premultiplied alpha) color to clear to.
     * Written premultiplied, matching the premultiplied-alpha color every
     * render target and the canvas hold (see `createRenderEcsSystem`).
     * Defaults to `Color.transparent`.
     */
    clear(color?: Color): void;
    /**
     * A 1x1 opaque white texture, for a sprite drawn as a solid color: the
     * sprite shader multiplies the texture by `tintColor`, so white leaves the
     * tint as it is. Owned by the render context.
     */
    get whiteTexture(): Texture;
    /**
     * A 1x1 opaque black texture: what a sampler a material hasn't set
     * samples, and the emissive map of a sprite without one. Owned by the
     * render context.
     */
    get blackTexture(): Texture;
    /**
     * The material every sprite without its own `material` draws with
     * (`sprite.vert` + `sprite.frag`), shared by all of them.
     */
    get spriteMaterial(): SpriteMaterial;
    /**
     * Returns the linked program for a vertex and fragment shader pair,
     * compiling and linking it the first time the pair is asked for. Every
     * `Material` made from the same two shader sources shares it. Asked for
     * while the context is lost, the program is linked when the context is
     * restored.
     * @param vertexShaderSource - The vertex shader source.
     * @param fragmentShaderSource - The fragment shader source.
     * @returns The shared program.
     * @throws An error if a shader fails to compile or link, if the two
     * shaders declare the same uniform with different types or sizes, or if
     * they declare a sampler other than `sampler2D`.
     */
    getShaderProgram(vertexShaderSource: ForgeShaderSource, fragmentShaderSource: ForgeShaderSource): ShaderProgram;
    setGlobalUniformValue(name: string, value: UniformValue): void;
    getGlobalUniformValue(name: string): UniformValue;
    /**
     * Re-requests the extensions the context lost with it, links every
     * program, rebuilds every other GPU resource, then raises
     * `onContextRestored`. A resource that fails to rebuild doesn't stop the
     * rest: the event is still raised, and the failures are thrown together
     * afterwards.
     */
    private _restore;
    /**
     * Requests the extensions the engine uses. Extensions are lost with the
     * context, so this runs again on every restore.
     * @returns Whether `EXT_color_buffer_float` is available.
     */
    private _requestExtensions;
}
/**
 * Options for {@link createRenderContext}.
 */
export interface RenderContextOptions {
    /**
     * The shader cache materials get their shaders from (default: a new
     * `createShaderCache()`, holding the engine's shaders and includes).
     */
    shaderCache?: ShaderCache;
    /** The cache images are loaded through (default: a new `ImageCache`). */
    imageCache?: ImageCache;
    /**
     * Whether `clear` clears the bound destination (default:
     * `CLEAR_STRATEGY.blank`). See `RenderContext.clearStrategy`.
     */
    clearStrategy?: CLEAR_STRATEGY_KEYS;
    /**
     * Whether the canvas keeps its drawing buffer after a frame is presented
     * (default: `false`), which reading the canvas's pixels back (e.g.
     * `toDataURL`) after the frame needs.
     */
    preserveDrawingBuffer?: boolean;
    /**
     * The highest pixel ratio to render at, however dense the display is
     * (default: no limit). See `RenderContext.maxPixelRatio`.
     */
    maxPixelRatio?: number;
}
/**
 * Creates a render context that draws into `canvas` with WebGL2.
 * `createGame` creates one for its game.
 * @param canvas - The canvas to draw into.
 * @param options - Options for the render context.
 * @returns The render context.
 * @throws An error if the canvas has no WebGL2 context, or if
 * `maxPixelRatio` isn't a positive number.
 */
export declare function createRenderContext(canvas: HTMLCanvasElement, options?: RenderContextOptions): RenderContext;
