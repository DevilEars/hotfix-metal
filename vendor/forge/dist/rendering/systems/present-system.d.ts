import { EcsSystem } from '../../ecs/ecs-system.js';
import { CameraEcsComponent } from '../components/index.js';
import { RenderContext } from '../render-context.js';
/**
 * Creates a system that presents each distinct off-screen render target in
 * use by a camera onto the canvas, by drawing the target's color texture
 * with a full-screen quad. Cameras without a `renderTarget` are left
 * untouched, since they already render directly onto the canvas. Cameras
 * that share the same `renderTarget` (for example a background and
 * foreground camera composited into one scene) only present it once per
 * frame.
 *
 * Multiple *different* render targets presented in the same frame (for
 * example a blurred background target and a separate, sharp foreground
 * target) are layered onto the canvas in ascending `CameraEcsComponent.layer`
 * order: the lowest layer clears the canvas and replaces it outright, and
 * every subsequent (higher) layer alpha-blends on top instead, so later
 * layers don't erase earlier ones. If any camera renders straight to the
 * canvas, the canvas already holds this frame's output from that camera, so
 * every layer (the lowest included) alpha-blends on top of it instead of
 * replacing it: canvas cameras always end up beneath every presented render
 * target, regardless of `layer`.
 *
 * Render targets hold premultiplied-alpha color (see
 * `createRenderEcsSystem`), so layers are blended with
 * `blendFunc(ONE, ONE_MINUS_SRC_ALPHA)`: a translucent pixel in a target
 * reaches the canvas at exactly the opacity it was drawn with.
 *
 * `update` first gathers each camera's `renderTarget` and `layer`, then
 * dedupes and sorts them, then does the actual presenting, since the draw
 * order depends on every camera's `layer` and can only be resolved once the
 * whole tick's cameras are known.
 * @param renderContext The rendering context
 * @returns The present ECS system
 */
export declare const createPresentEcsSystem: (renderContext: RenderContext) => EcsSystem<[CameraEcsComponent]>;
