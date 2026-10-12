import { Time } from '../../common/time/Time.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { Random } from '../../math/random.js';
import { ParticleEmitterEcsComponent } from '../components/particle-emitter-component.js';
/**
 * Creates an ECS system that spawns particles from every
 * `ParticleEmitterEcsComponent`'s emitters: the batches started by
 * `emit()`/`emitIfNotEmitting()`, and the steady stream set by
 * `emissionRate`. Particles spawn around the world position
 * (`PositionEcsComponent.world`) of the entity the emitter is on, or the
 * world origin if it has no position. Each emitter's spawn shape and
 * `directionRange` turn with the entity's world rotation
 * (`RotationEcsComponent.world`), or don't turn if it has no rotation.
 *
 * An emitter on an entity hidden in the hierarchy (see
 * `VisibilityEcsComponent`) spawns nothing, but its batches and stream
 * keep their timing, so showing it again picks up where a visible emitter
 * would be rather than spawning the particles it skipped. Particles
 * already spawned are their own entities and live out their lifetimes.
 * @param time - The time instance used to advance emitter timers.
 * @param random - The random instance used to pick values from emitter ranges.
 * @returns The particle emitter ECS system.
 */
export declare const createParticleEcsSystem: (time: Time, random: Random) => EcsSystem<[ParticleEmitterEcsComponent]>;
