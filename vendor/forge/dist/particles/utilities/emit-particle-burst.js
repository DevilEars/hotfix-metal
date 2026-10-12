import { pickParticleCount, spawnParticle } from './spawn-particle.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const defaultEmitParticleBurstOptions = {
    rotation: 0,
};
/**
 * Spawns a burst of particles from `particleEmitter` straight away, with its
 * spawn shape centered on `position`. The emitter doesn't need to be on an
 * entity, so this works for effects where something was just removed, such
 * as a pickup being collected. Particles spawned this way don't count
 * towards the emitter's own `emit()` progress.
 * @param world - The ECS world to create the particles in.
 * @param particleEmitter - The emitter describing the particles.
 * @param position - The world position to center the burst on.
 * @param random - The random instance used to pick values from the emitter's
 * ranges.
 * @param options - Options for the burst.
 * @returns The spawned particle entities.
 */
export function emitParticleBurst(world, particleEmitter, position, random, options = {}) {
    const { count, rotation } = withDefaults(defaultEmitParticleBurstOptions, options);
    const particleCount = count ?? pickParticleCount(particleEmitter, random);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(spawnParticle(world, particleEmitter, position, rotation, random));
    }
    return particles;
}
