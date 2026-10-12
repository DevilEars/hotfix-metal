import { EcsWorld } from '../ecs/index.js';
import { Vector2 } from '../math/index.js';
/**
 * Applies a radial impulse to every dynamic body within `radius` of
 * `center`, strongest at `center` and falling off linearly to zero at
 * `radius`. Distance and direction are measured to each body's center of
 * mass, and the impulse passes through it, so it never imparts spin.
 * Bodies with no `RigidBodyEcsComponent`, `'static'`/`'kinematic'` bodies
 * (see {@link RigidBodyType}), and bodies whose center of mass is at or
 * beyond `radius` are untouched.
 * @param world - The ECS world to search for dynamic bodies in.
 * @param center - The explosion's world-space origin.
 * @param force - The impulse magnitude at `center`.
 * @param radius - The distance beyond which bodies are unaffected.
 */
export declare function applyExplosiveForce(world: EcsWorld, center: Vector2, force: number, radius: number): void;
