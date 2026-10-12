import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/vector2.js';
/**
 * A function returning a velocity, in world units per second, that's added
 * to a particle's own velocity when it moves each frame. It's read every
 * frame, so it can follow game state (for example how fast the world is
 * scrolling past).
 */
export type ParticleVelocityOffsetFunction = () => Vector2;
/**
 * ECS-style component interface for a particle.
 */
export interface ParticleEcsComponent {
    /**
     * The particle's velocity, in world units per second. Changed every frame
     * by `acceleration` and `drag`, and free for game code to change too.
     */
    velocity: Vector2;
    /**
     * A constant acceleration, in world units per second squared, added to
     * `velocity` every frame. Covers gravity and steady drift alike.
     */
    acceleration: Vector2;
    /**
     * The share of `velocity` kept after one second, from `0` to `1`. `1`
     * means no drag, `0.25` means the particle keeps a quarter of its speed
     * after one second.
     */
    drag: number;
    /**
     * How fast the particle spins, in radians per second. Spin only changes
     * the particle's `RotationEcsComponent`, never the direction it moves in.
     */
    rotationSpeed: number;
    /**
     * The particle's sprite opacity when it spawns, from `0` to `1`.
     */
    startOpacity: number;
    /**
     * The particle's sprite opacity at the end of its lifetime, from `0` to
     * `1`. `createParticleOpacityEcsSystem` blends from `startOpacity` to
     * this.
     */
    endOpacity: number;
    /**
     * An extra velocity read every frame and added to `velocity` when the
     * particle moves. Unlike `velocity`, `drag` doesn't slow it down.
     */
    getVelocityOffset?: ParticleVelocityOffsetFunction;
}
export declare const ParticleId: import("../../ecs/ecs-component.js").ComponentKey<ParticleEcsComponent>;
/**
 * Attaches a {@link ParticleEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the particle.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addParticleComponent(world: EcsWorld, entity: number, options?: Partial<ParticleEcsComponent>): ParticleEcsComponent;
