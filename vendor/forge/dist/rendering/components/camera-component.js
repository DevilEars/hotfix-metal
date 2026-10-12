import { createComponentId } from '../../ecs/ecs-component.js';
import { Color } from '../color.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/** The component key of {@link CameraEcsComponent}. */
export const cameraId = createComponentId('camera');
const defaultCameraOptions = {
    zoom: 1,
    zoomSensitivity: 0.1,
    panSensitivity: 1,
    minZoom: 0.1,
    maxZoom: 10,
    isStatic: false,
    cullingMask: 0xffffffff,
    layer: 0,
    clearColor: Color.transparent,
    verticalWorldUnits: 10,
    ySort: false,
};
/**
 * Attaches a {@link CameraEcsComponent} to `entity`. A camera also needs a
 * `PositionEcsComponent` (see `addPositionComponent`) for `createCameraEcsSystem` to
 * pan it; use `createCamera` to get both on a fresh entity in one call.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the camera.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addCameraComponent(world, entity, options = {}) {
    const component = withDefaults(defaultCameraOptions, options);
    return world.addComponent(entity, cameraId, component);
}
