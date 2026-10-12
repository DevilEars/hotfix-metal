import { Vector2 } from './vector2.js';
/**
 * Gradually changes a 2D position towards a target position using a smoothing function,
 * simulating a critically damped spring. This function is useful for smooth interpolation
 * of positions (e.g., camera movement, UI elements) where you want to avoid overshooting
 * and oscillation.
 *
 * @param position - The current position as a Vector2.
 * @param targetPosition - The target position to move towards as a Vector2.
 * @param velocity - The current velocity as a Vector2. This is not mutated;
 * use the returned `velocityOutput` as the `velocity` for the next call.
 * @param maxSpeed - The maximum speed at which the position can change.
 * @param smoothTime - The approximate time it takes to reach the target. Smaller values result in faster movement.
 * @param deltaTimeInSeconds - The time elapsed since the last call, in seconds.
 * @returns An object containing:
 *   - `positionOutput`: The new, smoothed position as a Vector2.
 *   - `velocityOutput`: The updated velocity as a Vector2.
 *
 * @remarks
 * This function prevents overshooting and clamps the maximum change per update to `maxSpeed * smoothTime`.
 * `velocityOutput` reflects the new rate of change and should be passed back in as `velocity` on the next call.
 */
export declare function smoothDampVector2(position: Vector2, targetPosition: Vector2, velocity: Vector2, maxSpeed: number, smoothTime: number, deltaTimeInSeconds: number): {
    positionOutput: Vector2;
    velocityOutput: Vector2;
};
