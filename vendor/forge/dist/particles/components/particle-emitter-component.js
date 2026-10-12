import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const ParticleEmitterId = createComponentId('ParticleEmitter');
/**
 * Attaches a {@link ParticleEmitterEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the particle emitter.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addParticleEmitterComponent(world, entity, options = {}) {
    // `emitters` defaults to a fresh Map per call (rather than a shared
    // module-level default) since it's mutated in place by callers.
    const defaultParticleEmitterOptions = {
        emitters: new Map(),
    };
    const component = withDefaults(defaultParticleEmitterOptions, options);
    return world.addComponent(entity, ParticleEmitterId, component);
}
