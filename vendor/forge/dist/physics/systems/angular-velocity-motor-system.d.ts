import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { AngularVelocityMotorEcsComponent } from '../components/angular-velocity-motor-component.js';
import { RigidBodyEcsComponent } from '../components/rigidbody-component.js';
/**
 * Creates an ECS system that drives every entity with an
 * `AngularVelocityMotorEcsComponent` toward `targetVelocity`, clamped by
 * `maxTorque`. Recomputed fresh from the body's current angular velocity
 * every tick (no warm-starting), so it automatically recovers after an
 * external disturbance (a collision, a scripted torque). Order relative to
 * other physics systems doesn't matter beyond running before whatever
 * system integrates velocity into position
 * (`createEulerIntegrationEcsSystem`). Entities whose `RigidBodyEcsComponent.type`
 * (see {@link RigidBodyType}) isn't `'dynamic'` are skipped, since
 * `'static'`/`'kinematic'` bodies aren't affected by torque.
 * @param time - Used to read the tick's delta time.
 * @returns An ECS system that drives every motor-equipped entity's angular
 * velocity every tick.
 */
export declare const createAngularVelocityMotorEcsSystem: (time: Time) => EcsSystem<[AngularVelocityMotorEcsComponent, RigidBodyEcsComponent]>;
