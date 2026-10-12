import { EcsSystem } from '../../ecs/ecs-system.js';
import { CameraEcsComponent, GaussianBlurEcsComponent } from '../components/index.js';
import { RenderContext } from '../render-context.js';
/**
 * Creates a two-pass separable Gaussian blur post-processing system.
 *
 * For each camera with both a `renderTarget` and a `GaussianBlurEcsComponent`,
 * blurs that target's contents in place: each pass is a horizontal then a
 * vertical blur through internal scratch buffers, and the last pass renders
 * the result back into the camera's `renderTarget`. Cameras without a
 * `renderTarget`, or without a `GaussianBlurEcsComponent` (attach one with
 * `addGaussianBlurComponent`), are left untouched.
 *
 * The blur is sized in CSS pixels, so the same `passes` look the same on
 * every display: on a high-DPI display (`RenderContext.pixelRatio` above
 * `1`) the scene is first averaged down to CSS-pixel resolution, blurred
 * there, and scaled back up by the last pass.
 *
 * Each pass costs two full-screen draws of the 9-tap kernel, at CSS-pixel
 * resolution. On a high-DPI display, one more draw averages the scene down
 * first. An `intensity` between `0` and `1` adds one more draw, which blends
 * the sharp scene with the blurred one in a post-processing pass over the
 * camera's `renderTarget` (allocating its second color buffer the first
 * time). The first time a render target is blurred, the system allocates a
 * `PingPongTarget` for it at CSS-pixel resolution, in the render target's
 * `format`, resizes it when the render target's size changes, and disposes
 * it in `cleanup`.
 *
 * Must be registered after the render system (so there's a scene to blur)
 * and before the present system (so the blurred result gets drawn to the
 * canvas).
 * @param renderContext The rendering context
 * @returns The Gaussian blur ECS system
 */
export declare const createGaussianBlurEcsSystem: (renderContext: RenderContext) => EcsSystem<[CameraEcsComponent, GaussianBlurEcsComponent]>;
