import { PositionEcsComponent } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { ColliderEcsComponent } from '../components/collider-component.js';
/**
 * Creates an ECS system that stops fast dynamic circles from passing into
 * or through static colliders between two ticks (continuous collision
 * detection).
 *
 * Narrow-phase collision only tests where each body is at the start of a
 * tick, so a body that integration then moves further than the gap to a
 * surface ends up deep inside it, or out the other side, before the next
 * tick's test runs. This system sweeps the center of each dynamic body's
 * {@link CircleCollider} (which is the body's center of mass) from where
 * this tick's collision detection saw it (`position.world` and
 * `rotation.world`) to where integration just moved it (`position.local`
 * and `rotation.local`) in a straight line, against every static collider (an entity with no
 * `RigidBodyEcsComponent`, or a `'static'` one) its path overlaps and its
 * category and mask let it collide with. Sensors are never swept and never
 * stop anything, since nothing is resolved against them. If it
 * would sink more than a tenth of its radius into one, the system moves
 * `position.local` back so the circle's center is where the circle first
 * touched that collider, leaving it just inside the surface. Rotation and
 * velocity are left alone: the next
 * tick's narrow phase reports that contact and collision resolution
 * responds to it (friction, restitution) as it does for any other.
 *
 * Register it directly after `createEulerIntegrationEcsSystem`, whose
 * output it checks. A body moved directly (a teleport) must be moved
 * before `createTransformEcsSystem` runs, or the sweep treats the jump as
 * motion and can stop it at a wall in between. A swept body keeps its full
 * velocity but covers less ground this tick, the same trade Box2D makes.
 * Polygon bodies and kinematic or dynamic targets aren't swept.
 * @returns The ECS system.
 */
export declare const createContinuousCollisionEcsSystem: () => EcsSystem<[PositionEcsComponent, ColliderEcsComponent]>;
