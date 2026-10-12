import { Resizable } from '../common/index.js';
/**
 * An active size sync started by `createContainerResizeSync`.
 */
export interface ContainerResizeSync {
    /**
     * Stops watching the container for size and device pixel ratio changes.
     */
    stop(): void;
}
/**
 * Watches `container` for size changes and calls `resize()` on every entry
 * in `resizables` whenever the container's size changes, so a canvas (and
 * anything derived from its width/height, such as a camera's projection
 * matrix) follows the container, for example when the page is resized or
 * the container goes fullscreen.
 *
 * Also watches the display's `devicePixelRatio`, and resizes again whenever
 * it changes (browser zoom, or moving the window to a monitor with a
 * different scale factor), even if the container's CSS size stays the same,
 * so a canvas's drawing buffer keeps matching the display's native
 * resolution. Each resizable receives the container's size in CSS pixels
 * plus the current device pixel ratio, and derives its own drawing-buffer
 * size from them (see `RenderContext.resize`).
 *
 * The resize runs on the animation frame after the change, not inside the
 * `ResizeObserver` callback, since resizing from the callback triggers the
 * browser's "ResizeObserver loop completed with undelivered notifications"
 * error. A change to a zero width or height is skipped.
 *
 * Watching starts immediately and runs independently of any game loop
 * until the returned `stop()` is called. Call `stop()` when the container
 * is removed from the page: the device pixel ratio listener references the
 * container and the resizables until then.
 *
 * Does nothing (and returns a no-op `stop()`) if `resizables` is empty.
 * @param container - The element to watch for size changes.
 * @param resizables - The resizable objects (e.g. `RenderContext` instances) to resize whenever `container`'s size changes.
 * @returns An object whose `stop()` disconnects the observer and stops
 * watching the device pixel ratio.
 */
export declare function createContainerResizeSync(container: HTMLElement, resizables: readonly Resizable[]): ContainerResizeSync;
