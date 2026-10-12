import { positionId } from '../../common/components/position-component.js';
import { rotationId } from '../../common/components/rotation-component.js';
import { isVisibleInHierarchy } from '../../rendering/components/visibility-component.js';
import { ParticleEmitterId, } from '../components/particle-emitter-component.js';
import { pickParticleCount, spawnParticle, } from '../utilities/spawn-particle.js';
const worldOrigin = { x: 0, y: 0 };
function startEmittingParticles(particleEmitter, random) {
    if (particleEmitter.startEmitting) {
        particleEmitter.currentEmitDuration = 0;
        particleEmitter.startEmitting = false;
        particleEmitter.emitCount = 0;
        particleEmitter.currentlyEmitting = true;
        particleEmitter.totalAmountToEmit = pickParticleCount(particleEmitter, random);
    }
}
function getAmountToEmitBasedOnDuration(particleEmitter) {
    if (particleEmitter.emitDurationSeconds <= 0) {
        return particleEmitter.totalAmountToEmit - particleEmitter.emitCount;
    }
    const emitProgress = Math.min(particleEmitter.currentEmitDuration / particleEmitter.emitDurationSeconds, 1);
    const targetEmitCount = Math.ceil(emitProgress * particleEmitter.totalAmountToEmit);
    return targetEmitCount - particleEmitter.emitCount;
}
function emitNewParticles(particleEmitter, origin, rotation, random, world, visible) {
    if (!particleEmitter.currentlyEmitting ||
        particleEmitter.emitCount >= particleEmitter.totalAmountToEmit) {
        particleEmitter.currentlyEmitting = false;
        return;
    }
    const currentAmountToEmit = getAmountToEmitBasedOnDuration(particleEmitter);
    // A hidden emitter's batch still runs its course, so showing the emitter
    // again doesn't release the particles it skipped all at once.
    for (let i = 0; visible && i < currentAmountToEmit; i++) {
        spawnParticle(world, particleEmitter, origin, rotation, random);
    }
    particleEmitter.emitCount += currentAmountToEmit;
}
function emitParticleStream(particleEmitter, origin, rotation, deltaTimeInSeconds, random, world, visible) {
    if (particleEmitter.emissionRate <= 0) {
        particleEmitter.emissionRemainder = 0;
        return;
    }
    const due = particleEmitter.emissionRemainder +
        particleEmitter.emissionRate * deltaTimeInSeconds;
    const amountToEmit = Math.floor(due);
    particleEmitter.emissionRemainder = due - amountToEmit;
    for (let i = 0; visible && i < amountToEmit; i++) {
        spawnParticle(world, particleEmitter, origin, rotation, random);
    }
}
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
export const createParticleEcsSystem = (time, random) => ({
    query: [ParticleEmitterId],
    update: (world, { entities, components: [particleEmitterComponents] }) => {
        const { deltaTimeInSeconds } = time;
        for (let i = 0; i < entities.length; i++) {
            const origin = world.getComponent(entities[i], positionId)?.world ?? worldOrigin;
            const rotation = world.getComponent(entities[i], rotationId)?.world ?? 0;
            const visible = isVisibleInHierarchy(world, entities[i]);
            for (const particleEmitter of particleEmitterComponents[i].emitters.values()) {
                particleEmitter.currentEmitDuration += deltaTimeInSeconds;
                startEmittingParticles(particleEmitter, random);
                emitNewParticles(particleEmitter, origin, rotation, random, world, visible);
                emitParticleStream(particleEmitter, origin, rotation, deltaTimeInSeconds, random, world, visible);
            }
        }
    },
});
