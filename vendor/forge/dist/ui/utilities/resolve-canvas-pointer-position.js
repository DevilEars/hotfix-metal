import { positionId } from '../../common/index.js';
import { cameraId, computeCameraView, } from '../../rendering/index.js';
/**
 * Converts a pointer position - CSS pixels from the canvas's top-left
 * corner, Y-down, e.g. `UiPointerSource.position` - into
 * `canvas`'s own UI world space, through its dedicated camera. Two canvases
 * with different cameras (e.g. different `verticalWorldUnits`) convert the
 * same pointer position differently, which is why this takes a specific
 * canvas rather than publishing one shared "the" UI world position.
 * @param world - The ECS world `canvas`'s camera entity belongs to.
 * @param canvas - The canvas to convert the pointer position for.
 * @param renderContext - The render context the canvas's camera renders
 * through.
 * @param viewportPosition - The pointer position, in CSS pixels from the
 * canvas's top-left corner, Y-down.
 * @returns The pointer position in `canvas`'s UI world space, or `null` if
 * the canvas's camera entity is missing its `CameraEcsComponent`/
 * `PositionEcsComponent`.
 */
export function resolveCanvasPointerPosition(world, canvas, renderContext, viewportPosition) {
    const camera = world.getComponent(canvas.camera, cameraId);
    const cameraPosition = world.getComponent(canvas.camera, positionId);
    if (!camera || !cameraPosition) {
        return null;
    }
    return computeCameraView(camera, cameraPosition, renderContext).viewportToWorld(viewportPosition);
}
