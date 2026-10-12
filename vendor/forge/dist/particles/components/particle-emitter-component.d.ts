import { ParticleEmitter } from './particle-emitter.js';
import { EcsWorld } from '../../ecs/ecs-world.js';
/**
 * ECS-style component interface for the particle emitter.
 */
export interface ParticleEmitterEcsComponent {
    emitters: Map<string, ParticleEmitter>;
}
export declare const ParticleEmitterId: import("../../ecs/ecs-component.js").ComponentKey<ParticleEmitterEcsComponent>;
/**
 * Attaches a {@link ParticleEmitterEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the particle emitter.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addParticleEmitterComponent(world: EcsWorld, entity: number, options?: Partial<ParticleEmitterEcsComponent>): ParticleEmitterEcsComponent;
