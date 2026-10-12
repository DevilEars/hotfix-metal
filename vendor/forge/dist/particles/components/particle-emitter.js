import { Vec2 } from '../../math/vector2.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const defaultOptions = {
    numParticlesRange: { min: 5, max: 10 },
    speedRange: { min: 10, max: 20 },
    directionRange: { min: 0, max: Math.PI * 2 },
    scaleRange: { min: 1, max: 1 },
    rotationRange: { min: 0, max: 0 },
    rotationSpeedRange: { min: 0, max: 0 },
    lifetimeSecondsRange: { min: 1, max: 3 },
    lifetimeScaleReduction: 0,
    lifetimeOpacity: { start: 1, end: 1 },
    acceleration: Vec2.zero,
    drag: 1,
    spawnShape: { type: 'point' },
    emitOutward: false,
    emitDurationSeconds: 0,
    emissionRate: 0,
};
function assertValidOptions(options) {
    if (options.drag < 0 || options.drag > 1) {
        throw new Error(`Particle emitter "drag" must be between 0 and 1, but was ${options.drag}.`);
    }
    if (options.emissionRate < 0) {
        throw new Error(`Particle emitter "emissionRate" can't be negative, but was ${options.emissionRate}.`);
    }
}
/**
 * Represents a particle Emitter.
 * This class is used to define properties and behavior for particles emitters,
 * to configure the spawning and function of the particles.
 */
export class ParticleEmitter {
    sprite;
    numParticlesRange;
    speedRange;
    directionRange;
    scaleRange;
    rotationRange;
    rotationSpeedRange;
    lifetimeSecondsRange;
    lifetimeScaleReduction;
    lifetimeOpacity;
    acceleration;
    drag;
    spawnShape;
    emitOutward;
    emitDurationSeconds;
    emissionRate;
    getVelocityOffset;
    onParticleSpawned;
    currentEmitDuration;
    emitCount;
    totalAmountToEmit;
    startEmitting;
    currentlyEmitting;
    /**
     * The fraction of a particle `emissionRate` has built up but not spawned
     * yet, carried between frames so a rate that isn't a multiple of the frame
     * rate still averages out.
     */
    emissionRemainder;
    /**
     * Creates a new ParticleEmitter instance.
     * @param sprite The sprite to draw the particles with. Every particle gets
     * its own copy, so changing one particle's sprite never changes another's.
     * The particles are drawn on `sprite.layer`.
     * @param options The options to configure the particle emitter.
     * @throws An error if `drag` isn't between 0 and 1, or `emissionRate` is
     * negative.
     */
    constructor(sprite, options = {}) {
        const resolvedOptions = withDefaults(defaultOptions, options);
        assertValidOptions(resolvedOptions);
        this.sprite = sprite;
        this.numParticlesRange = resolvedOptions.numParticlesRange;
        this.speedRange = resolvedOptions.speedRange;
        this.directionRange = resolvedOptions.directionRange;
        this.scaleRange = resolvedOptions.scaleRange;
        this.rotationRange = resolvedOptions.rotationRange;
        this.rotationSpeedRange = resolvedOptions.rotationSpeedRange;
        this.lifetimeSecondsRange = resolvedOptions.lifetimeSecondsRange;
        this.lifetimeScaleReduction = resolvedOptions.lifetimeScaleReduction;
        this.lifetimeOpacity = resolvedOptions.lifetimeOpacity;
        this.acceleration = resolvedOptions.acceleration;
        this.drag = resolvedOptions.drag;
        this.spawnShape = resolvedOptions.spawnShape;
        this.emitOutward = resolvedOptions.emitOutward;
        this.emitDurationSeconds = resolvedOptions.emitDurationSeconds;
        this.emissionRate = resolvedOptions.emissionRate;
        this.getVelocityOffset = resolvedOptions.getVelocityOffset;
        this.onParticleSpawned = resolvedOptions.onParticleSpawned;
        this.currentEmitDuration = 0;
        this.emitCount = 0;
        this.totalAmountToEmit = 0;
        this.startEmitting = false;
        this.currentlyEmitting = false;
        this.emissionRemainder = 0;
    }
    /**
     * Sets the options for the particle emitter. Options left out keep their
     * current value. Particles that have already spawned aren't affected.
     * @param options The options to configure the particle emitter.
     * @throws An error if `drag` isn't between 0 and 1, or `emissionRate` is
     * negative.
     */
    setOptions(options) {
        const resolvedOptions = withDefaults(this, options);
        assertValidOptions(resolvedOptions);
        this.numParticlesRange = resolvedOptions.numParticlesRange;
        this.speedRange = resolvedOptions.speedRange;
        this.directionRange = resolvedOptions.directionRange;
        this.scaleRange = resolvedOptions.scaleRange;
        this.rotationRange = resolvedOptions.rotationRange;
        this.rotationSpeedRange = resolvedOptions.rotationSpeedRange;
        this.lifetimeSecondsRange = resolvedOptions.lifetimeSecondsRange;
        this.lifetimeScaleReduction = resolvedOptions.lifetimeScaleReduction;
        this.lifetimeOpacity = resolvedOptions.lifetimeOpacity;
        this.acceleration = resolvedOptions.acceleration;
        this.drag = resolvedOptions.drag;
        this.spawnShape = resolvedOptions.spawnShape;
        this.emitOutward = resolvedOptions.emitOutward;
        this.emitDurationSeconds = resolvedOptions.emitDurationSeconds;
        this.emissionRate = resolvedOptions.emissionRate;
        this.getVelocityOffset = resolvedOptions.getVelocityOffset;
        this.onParticleSpawned = resolvedOptions.onParticleSpawned;
    }
    /**
     * Emits particles from the emitter if it is not already emitting.
     * If already emitting, this function call does nothing.
     */
    emitIfNotEmitting() {
        if (!this.currentlyEmitting) {
            this.startEmitting = true;
        }
    }
    /**
     * Starts emitting particles from the emitter immediately.
     */
    emit() {
        this.startEmitting = true;
    }
}
