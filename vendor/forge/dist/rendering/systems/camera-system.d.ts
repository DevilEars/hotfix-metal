import { PositionEcsComponent, Time } from '../../common/index.js';
import { CameraEcsComponent } from '../components/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
/**
 * Creates a system that zooms and pans cameras from input. For each camera
 * that isn't `isStatic`, it scales `zoom` by `zoomInput`'s value (by
 * `zoomSensitivity`, clamped to `[minZoom, maxZoom]`), and moves
 * `position.local` by `panInput`'s value (by `panSensitivity`, divided by
 * `zoom`, per millisecond of raw delta time). Register it before
 * `createTransformEcsSystem`.
 * @param time - The time the pan speed is measured against.
 * @returns The camera ECS system.
 */
export declare const createCameraEcsSystem: (time: Time) => EcsSystem<[CameraEcsComponent, PositionEcsComponent]>;
