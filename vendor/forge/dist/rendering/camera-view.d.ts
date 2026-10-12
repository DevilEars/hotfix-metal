import { PositionEcsComponent } from '../common/index.js';
import { EcsWorld } from '../ecs/ecs-world.js';
import { Rect, Vector2 } from '../math/index.js';
import { CameraEcsComponent } from './components/index.js';
import { RenderContext } from './render-context.js';
/**
 * What a camera sees this frame, and conversions between its world and the
 * viewport (the canvas, in CSS pixels).
 *
 * Computed from the camera's components when asked for (see
 * `computeCameraView` and `getCameraView`), so it's never stored and can't
 * disagree with the camera.
 */
export interface CameraView {
    /** The world-space area the camera shows. */
    readonly bounds: Rect;
    /** `bounds`' size, in world units. */
    readonly size: Vector2;
    /** CSS pixels per world unit on the canvas. */
    readonly pixelsPerUnit: number;
    /**
     * Converts a world position to a viewport position: CSS pixels from the
     * canvas's top-left corner, Y-down, like pointer positions (e.g.
     * `MouseInputSource.position`).
     * @param worldPosition - The position in world space.
     * @returns A new vector holding the position on the canvas, in CSS pixels.
     */
    worldToViewport(worldPosition: Vector2): Vector2;
    /**
     * Converts a viewport position (CSS pixels from the canvas's top-left
     * corner, Y-down, e.g. `MouseInputSource.position`) to a world position.
     * The inverse of `worldToViewport`.
     * @param viewportPosition - The position on the canvas, in CSS pixels.
     * @returns A new vector holding the position in world space.
     */
    viewportToWorld(viewportPosition: Vector2): Vector2;
}
/**
 * Computes what a camera sees, from components a system already has.
 *
 * The view is `verticalWorldUnits / zoom` world units tall, centered on the
 * camera's `position.world`, with its width following the canvas's aspect
 * ratio. A camera with a `renderTarget` gets the same view: a present pass
 * stretches the target over the whole canvas, so its contents are laid out
 * at the canvas's aspect ratio. Viewport conversions are against the
 * canvas's CSS size, because pointer input, the DOM and safe-area insets
 * all measure in CSS pixels.
 *
 * The view reflects the components as they are when this is called: a
 * caller that runs before the transform system sees last frame's
 * `position.world`.
 * @param camera - The camera's `CameraEcsComponent`.
 * @param position - The camera's `PositionEcsComponent`.
 * @param renderContext - The render context the camera draws through.
 * @returns The camera's view.
 * @throws An error if the camera's `verticalWorldUnits` or `zoom`, or the
 * canvas's size, isn't positive.
 */
export declare function computeCameraView(camera: CameraEcsComponent, position: PositionEcsComponent, renderContext: RenderContext): CameraView;
/**
 * Computes what a camera entity sees. For game code that has the camera's
 * entity rather than its components; see `computeCameraView`.
 * @param world - The ECS world the camera entity belongs to.
 * @param camera - The camera entity.
 * @param renderContext - The render context the camera draws through.
 * @returns The camera's view.
 * @throws An error if `camera` has no `CameraEcsComponent` or
 * `PositionEcsComponent`, or if `computeCameraView` does.
 */
export declare function getCameraView(world: EcsWorld, camera: number, renderContext: RenderContext): CameraView;
