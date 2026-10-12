import { Vector2 } from '../../math/index.js';
import { RigidBodyEcsComponent } from '../components/rigidbody-component.js';
/**
 * The velocity of the point `r` (relative to `rigidBody`'s center of mass) on a
 * rotating, translating body: `velocity + angularVelocity × r`. Bodies with
 * no rigid body (static geometry) have no velocity anywhere. A
 * `'kinematic'` body's `velocity`/`angularVelocity` (set directly by game
 * code) is read normally here even though it has `0` inverse mass/inertia
 * in the solver - this is what lets a kinematic body still push a dynamic
 * body it contacts.
 * @param rigidBody - The rigid body, or `null` for static geometry.
 * @param r - The point to sample velocity at, relative to `rigidBody`'s
 * center of mass.
 * @returns The velocity of the point `r`.
 */
export declare function velocityAtPoint(rigidBody: RigidBodyEcsComponent | null, r: Vector2): Vector2;
