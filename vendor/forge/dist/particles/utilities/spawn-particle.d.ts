import { EcsWorld } from '../../ecs/ecs-world.js';
import { Random } from '../../math/random.js';
import { Vector2 } from '../../math/vector2.js';
import { ParticleEmitter } from '../components/particle-emitter.js';
/**
 * Picks how many particles one emission from `particleEmitter` spawns.
 * @param particleEmitter - The emitter to pick a count for.
 * @param random - The random instance used to pick from `numParticlesRange`.
 * @returns A whole number of particles.
 */
export declare function pickParticleCount(particleEmitter: ParticleEmitter, random: Random): number;
/**
 * Spawns one particle from `particleEmitter`, somewhere in its spawn shape
 * centered on `origin`. The spawn shape and the direction picked from
 * `directionRange` are in the emitter's frame, which is turned `rotation`
 * radians from the world's.
 * @param world - The ECS world to create the particle in.
 * @param particleEmitter - The emitter describing the particle.
 * @param origin - The world position the emitter's spawn shape is centered
 * on.
 * @param rotation - The emitter frame's world rotation, in radians,
 * counter-clockwise.
 * @param random - The random instance used to pick values from the emitter's
 * ranges.
 * @returns The particle entity.
 */
export declare function spawnParticle(world: EcsWorld, particleEmitter: ParticleEmitter, origin: Vector2, rotation: number, random: Random): number;
