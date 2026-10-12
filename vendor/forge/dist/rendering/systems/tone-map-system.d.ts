import { EcsSystem } from '../../ecs/ecs-system.js';
import { CameraEcsComponent, ToneMappingEcsComponent } from '../components/index.js';
import { RenderContext } from '../render-context.js';
/**
 * Creates a tone mapping post-processing system: compresses a camera's HDR
 * render target back into displayable `[0, 1]` range.
 *
 * For each camera with both a `renderTarget` and a
 * `ToneMappingEcsComponent`, applies the configured exposure and operator
 * (see `TONE_MAPPING_OPERATOR`) in one post-processing pass over that
 * `renderTarget` (see `beginPostProcessPass`). Cameras without a `renderTarget`, or without a
 * `ToneMappingEcsComponent` (attach one with `addToneMappingComponent`), are left
 * untouched.
 *
 * Must be registered after any HDR-producing passes (render, bloom, blur)
 * and before the present system, since anything left un-tone-mapped is
 * presented as-is and hard-clips at `[0, 1]` instead of rolling off
 * smoothly.
 *
 * Costs one full-screen draw per tone-mapped render target a frame. The
 * first time a render target is tone-mapped, it allocates its second color
 * buffer, at its own format and size.
 * @param renderContext The rendering context
 * @returns The tone mapping ECS system
 */
export declare const createToneMapEcsSystem: (renderContext: RenderContext) => EcsSystem<[CameraEcsComponent, ToneMappingEcsComponent]>;
