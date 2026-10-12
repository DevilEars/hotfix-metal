import { Matrix3x3, Rect } from '../../../math/index.js';
/**
 * Creates the projection matrix that maps a world-space area onto clip
 * space, filling the destination it's drawn into.
 *
 * @param bounds - The world-space area to show, such as a camera's
 * `CameraView.bounds` (see `computeCameraView`).
 * @returns A 3x3 projection matrix that can be used for rendering.
 */
export declare function createProjectionMatrix(bounds: Rect): Matrix3x3;
