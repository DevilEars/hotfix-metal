import { PositionEcsComponent, RotationEcsComponent, Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { RigidBodyEcsComponent } from '../components/rigidbody-component.js';
/**
 * Creates an ECS system to Euler integration of rigid body entities.
 * @returns An ECS system that updates position and rotation of a rigid body
 * based their respective velocity and angular velocity. `'static'` bodies
 * (see {@link RigidBodyType}) are skipped entirely - they never move and
 * are never integrated - while `'kinematic'` bodies are integrated the same
 * as `'dynamic'` ones, since a kinematic body's `velocity` is expected to be
 * driven directly by game code.
 *
 * Velocities are in world space. `velocity` is the velocity of the body's
 * center of mass, and a body turns about its center of mass (see
 * `getRigidBodyMassData`; for a `'kinematic'` body that's the entity's
 * origin). Both are integrated into the body's
 * `local` position and rotation, which `createTransformEcsSystem` turns
 * into `world`. Register the transform system before the physics systems,
 * which read `world`, so they see every entity's current pose, including
 * ones created or moved this tick. A body's integrated movement then
 * reaches `world` on the next tick's transform pass.
 *
 * A moving body must be a root entity. Its velocity is in world space, so
 * adding it to the local position of a body with a `ParentEcsComponent`
 * would be wrong as soon as the parent rotated, scaled or moved. Connect
 * bodies with joints and springs instead.
 * @param time - The time instance used to scale velocity by the frame's
 * duration.
 * @throws An error if a `'dynamic'` or `'kinematic'` body has a
 * `ParentEcsComponent`.
 */
export declare const createEulerIntegrationEcsSystem: (time: Time) => EcsSystem<[PositionEcsComponent, RotationEcsComponent, RigidBodyEcsComponent]>;
