import { EcsSystem } from '../../ecs/ecs-system.js';
import { BloomEcsComponent, CameraEcsComponent } from '../components/index.js';
import { RenderContext } from '../render-context.js';
/**
 * Creates a bloom post-processing system: an additive glow around the
 * brightest parts of the scene.
 *
 * For each camera with both a `renderTarget` and a `BloomEcsComponent`,
 * extracts the pixels brighter than `threshold` into a downsampled scratch
 * buffer, blurs them with the same separable technique as
 * `createGaussianBlurEcsSystem`, then adds the blurred result back onto the
 * camera's `renderTarget` in a post-processing pass (see
 * `beginPostProcessPass`). Cameras without a `renderTarget`, or without a
 * `BloomEcsComponent` (attach one with `addBloomComponent`), are left
 * untouched, and so are cameras whose bloom has `passes` or `intensity` at
 * `0` or below.
 *
 * Must be registered after the render system (so there's a scene to bloom)
 * and before the present system (so the result gets drawn to the canvas).
 * If a camera also has a `GaussianBlurEcsComponent`, register this system
 * before the blur system, so the glow gets softened along with the rest of
 * the scene rather than sharpening it back up afterwards.
 *
 * Each bloomed render target costs `2 * passes + 2` full-screen draws a
 * frame: one threshold pass, two blur draws per pass, and the composite. The
 * threshold and blur draws run at the downsampled resolution, a quarter of
 * the render target's size in CSS pixels along each axis. The first time a render
 * target is bloomed, the system allocates a downsampled bright-pass target
 * and a downsampled `PingPongTarget` for it, in the render target's
 * `format`, and the render target allocates its second color buffer for
 * the composite. The scratch targets are resized when the render target's
 * size changes, and disposed by the system's `cleanup`.
 * @param renderContext The rendering context
 * @returns The bloom ECS system
 */
export declare const createBloomEcsSystem: (renderContext: RenderContext) => EcsSystem<[CameraEcsComponent, BloomEcsComponent]>;
