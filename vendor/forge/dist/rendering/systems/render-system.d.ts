import { PositionEcsComponent } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { CameraEcsComponent } from '../components/index.js';
import { RenderContext } from '../render-context.js';
/**
 * Creates a render system that draws every camera's sprites and text.
 * Consecutive quads (in draw order) with the same material, texture and
 * emissive map draw in one instanced draw call. Each camera is projected
 * from its view (see `computeCameraView`), and sprites, nine-slice regions
 * and glyphs whose quads are outside that view are skipped before anything
 * is uploaded.
 *
 * Sprites and text hidden in the hierarchy (see `VisibilityEcsComponent`)
 * aren't drawn. The rest draw by `layer`, then by world order (see
 * `DrawOrderEcsComponent`), then, for a camera with `ySort`, by their root
 * entity's Y (higher first), then in hierarchy order: root entities in
 * creation order, each followed by its subtree in pre-order. That's a total
 * order, resolved and sorted once per frame with an exact radix sort. An
 * entity's sprite draws before its text.
 *
 * @param renderContext The rendering context
 * @returns The render ECS system
 */
export declare const createRenderEcsSystem: (renderContext: RenderContext) => EcsSystem<[CameraEcsComponent, PositionEcsComponent]>;
