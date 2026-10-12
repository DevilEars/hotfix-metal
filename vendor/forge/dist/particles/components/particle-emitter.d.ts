import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/vector2.js';
import { SpriteEcsComponent, SpriteRequiredOptions } from '../../rendering/components/sprite-component.js';
import { ParticleVelocityOffsetFunction } from './particle-component.js';
/**
 * Interface for range values with a min and max value.
 * The real value will be randomly chosen between min and max
 */
export interface Range {
    /**
     * The minimum value of the range.
     */
    min: number;
    /**
     * The maximum value of the range.
     */
    max: number;
}
/**
 * Every particle spawns exactly at the emitter's origin.
 */
export interface PointParticleSpawnShape {
    type: 'point';
}
/**
 * Particles spawn anywhere inside a circle, evenly spread over its area.
 */
export interface CircleParticleSpawnShape {
    type: 'circle';
    /** The circle's radius, in world units. */
    radius: number;
}
/**
 * Particles spawn on the edge of a circle.
 */
export interface RingParticleSpawnShape {
    type: 'ring';
    /** The ring's radius, in world units. */
    radius: number;
}
/**
 * Particles spawn anywhere inside a box centered on the emitter's origin.
 */
export interface BoxParticleSpawnShape {
    type: 'box';
    /** The box's width, in world units. */
    width: number;
    /** The box's height, in world units. */
    height: number;
}
/**
 * The area, around the emitter's origin, that particles spawn in.
 */
export type ParticleSpawnShape = PointParticleSpawnShape | CircleParticleSpawnShape | RingParticleSpawnShape | BoxParticleSpawnShape;
/**
 * The opacity a particle fades between over its lifetime.
 */
export interface ParticleLifetimeOpacity {
    /** The opacity when the particle spawns, from `0` to `1`. */
    start: number;
    /** The opacity at the end of the particle's lifetime, from `0` to `1`. */
    end: number;
}
/**
 * Called once for every particle right after it spawns, with all of its
 * components already attached. Use it to add your own components or tags
 * to the particle.
 */
export type ParticleSpawnedCallback = (world: EcsWorld, particle: number) => void;
/**
 * The sprite a particle emitter draws its particles with. Takes a
 * `SpriteEcsComponent` (for example from `createImageSprite`) or a `Sprite`
 * (from `createSprite`): any field a `Sprite` lacks, such as `category` or
 * `layer`, gets the same default `addSpriteComponent` gives it.
 */
export type ParticleSprite = SpriteRequiredOptions & Partial<SpriteEcsComponent>;
/**
 * Interface for particle emitter options.
 */
export interface ParticleEmitterOptions {
    /**
     * The range for the number of particles one `emit()` spawns, and the
     * default number `emitParticleBurst` spawns.
     * @default { min: 5, max: 10 }
     */
    numParticlesRange: Range;
    /**
     * The range for the speed particles spawn with, in world units per second.
     * @default { min: 10, max: 20 }
     */
    speedRange: Range;
    /**
     * The range for the direction particles move in when they spawn, in
     * radians, in the emitter's frame: `0` points along the emitter's local
     * `+X` and angles increase counter-clockwise (`Math.PI / 2` is its local
     * up). The emitter's frame is the world rotation of the entity it's on, or
     * the world's own when the entity has no rotation. A range spanning a full
     * turn picks from the whole circle. Ignored when `emitOutward` is `true`,
     * except for particles spawned at the shape's exact center.
     * @default { min: 0, max: 2π }
     */
    directionRange: Range;
    /**
     * The range for the scale of particles.
     * @default { min: 1, max: 1 }
     */
    scaleRange: Range;
    /**
     * The range for the initial world rotation of each particle's sprite, in
     * radians, counter-clockwise. This only turns the sprite; it doesn't change
     * the direction the particle moves in, and it doesn't follow the emitter's
     * rotation.
     * @default { min: 0, max: 0 }
     */
    rotationRange: Range;
    /**
     * The range for how fast each particle's sprite spins, in radians per
     * second.
     * @default { min: 0, max: 0 }
     */
    rotationSpeedRange: Range;
    /**
     * The range for the lifetime of particles in seconds.
     * @default { min: 1, max: 3 }
     */
    lifetimeSecondsRange: Range;
    /**
     * The factor by which the particle scale reduces over its lifetime.
     * The particle scale at the end of its lifetime will be scale * lifetimeScaleReduction
     * @default 0
     */
    lifetimeScaleReduction: number;
    /**
     * The opacity each particle fades between over its lifetime. Needs
     * `createParticleOpacityEcsSystem`.
     * @default { start: 1, end: 1 }
     */
    lifetimeOpacity: ParticleLifetimeOpacity;
    /**
     * A constant acceleration, in world units per second squared, applied to
     * every particle. It's in world space, so it doesn't turn with the
     * emitter. For example `{ x: 0, y: -9.8 }` for gravity.
     * @default { x: 0, y: 0 }
     */
    acceleration: Vector2;
    /**
     * The share of a particle's velocity it keeps after one second, from `0`
     * to `1`. `1` means no drag.
     * @default 1
     */
    drag: number;
    /**
     * The area, centered on the emitter's origin, that particles spawn in. The
     * origin is the world position of the entity the emitter is on, or the
     * position passed to `emitParticleBurst`. The shape turns with the
     * emitter's frame (see `directionRange`).
     * @default { type: 'point' }
     */
    spawnShape: ParticleSpawnShape;
    /**
     * When `true`, each particle moves away from the center of `spawnShape`,
     * through the point it spawned at, instead of in a direction picked from
     * `directionRange`.
     * @default false
     */
    emitOutward: boolean;
    /**
     * The duration over which one `emit()` spreads its particles. `0` spawns
     * them all at once.
     * @default 0
     */
    emitDurationSeconds: number;
    /**
     * How many particles a second the emitter spawns steadily, for as long as
     * it's above `0`, on top of anything `emit()` spawns.
     * @default 0
     */
    emissionRate: number;
    /**
     * An extra velocity every particle reads each frame and adds to its own,
     * for motion that follows game state, such as a world that scrolls past.
     * @default undefined
     */
    getVelocityOffset?: ParticleVelocityOffsetFunction;
    /**
     * Called for every particle right after it spawns.
     * @default undefined
     */
    onParticleSpawned?: ParticleSpawnedCallback;
}
/**
 * Represents a particle Emitter.
 * This class is used to define properties and behavior for particles emitters,
 * to configure the spawning and function of the particles.
 */
export declare class ParticleEmitter {
    sprite: ParticleSprite;
    numParticlesRange: Range;
    speedRange: Range;
    directionRange: Range;
    scaleRange: Range;
    rotationRange: Range;
    rotationSpeedRange: Range;
    lifetimeSecondsRange: Range;
    lifetimeScaleReduction: number;
    lifetimeOpacity: ParticleLifetimeOpacity;
    acceleration: Vector2;
    drag: number;
    spawnShape: ParticleSpawnShape;
    emitOutward: boolean;
    emitDurationSeconds: number;
    emissionRate: number;
    getVelocityOffset?: ParticleVelocityOffsetFunction;
    onParticleSpawned?: ParticleSpawnedCallback;
    currentEmitDuration: number;
    emitCount: number;
    totalAmountToEmit: number;
    startEmitting: boolean;
    currentlyEmitting: boolean;
    /**
     * The fraction of a particle `emissionRate` has built up but not spawned
     * yet, carried between frames so a rate that isn't a multiple of the frame
     * rate still averages out.
     */
    emissionRemainder: number;
    /**
     * Creates a new ParticleEmitter instance.
     * @param sprite The sprite to draw the particles with. Every particle gets
     * its own copy, so changing one particle's sprite never changes another's.
     * The particles are drawn on `sprite.layer`.
     * @param options The options to configure the particle emitter.
     * @throws An error if `drag` isn't between 0 and 1, or `emissionRate` is
     * negative.
     */
    constructor(sprite: ParticleSprite, options?: Partial<ParticleEmitterOptions>);
    /**
     * Sets the options for the particle emitter. Options left out keep their
     * current value. Particles that have already spawned aren't affected.
     * @param options The options to configure the particle emitter.
     * @throws An error if `drag` isn't between 0 and 1, or `emissionRate` is
     * negative.
     */
    setOptions(options: Partial<ParticleEmitterOptions>): void;
    /**
     * Emits particles from the emitter if it is not already emitting.
     * If already emitting, this function call does nothing.
     */
    emitIfNotEmitting(): void;
    /**
     * Starts emitting particles from the emitter immediately.
     */
    emit(): void;
}
