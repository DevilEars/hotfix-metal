import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { GravityEcsComponent } from '../components/gravity-component.js';
import { RigidBodyEcsComponent } from '../components/rigidbody-component.js';
/**
 * Creates an ECS system to handle gravity of rigid body entities.
 * @returns An ECS system that updates velocity of a rigid body based on
 * gravity. `'static'` and `'kinematic'` bodies (see {@link RigidBodyType})
 * are skipped - neither is affected by forces.
 */
export declare const createGravityEcsSystem: (time: Time) => EcsSystem<[RigidBodyEcsComponent, GravityEcsComponent]>;
