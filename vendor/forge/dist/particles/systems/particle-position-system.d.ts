import { PositionEcsComponent } from '../../common/components/position-component.js';
import { RotationEcsComponent } from '../../common/components/rotation-component.js';
import { Time } from '../../common/time/Time.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { ParticleEcsComponent } from '../components/particle-component.js';
/**
 * Creates an ECS system that moves and spins every particle: it applies each
 * particle's acceleration and drag to its velocity, moves it by that velocity
 * (plus its velocity offset, if any), and turns its rotation by its rotation
 * speed.
 *
 * It writes each particle's local position and rotation;
 * `createTransformEcsSystem` turns them into the world transform.
 * @param time - The time instance used to determine how far to move and rotate particles each frame.
 * @returns The particle position ECS system.
 */
export declare const createParticlePositionEcsSystem: (time: Time) => EcsSystem<[PositionEcsComponent, RotationEcsComponent, ParticleEcsComponent]>;
