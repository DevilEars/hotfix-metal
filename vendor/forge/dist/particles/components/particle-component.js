import { createComponentId } from '../../ecs/ecs-component.js';
import { Vec2 } from '../../math/vector2.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const ParticleId = createComponentId('Particle');
/**
 * Attaches a {@link ParticleEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the particle.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addParticleComponent(world, entity, options = {}) {
    // Built inside the function body (rather than as a shared module-level
    // default) since `velocity` and `acceleration` are mutated in place, so
    // each particle needs its own `Vector2` instances.
    const defaultParticleOptions = {
        velocity: Vec2.zero,
        acceleration: Vec2.zero,
        drag: 1,
        rotationSpeed: 0,
        startOpacity: 1,
        endOpacity: 1,
    };
    const component = withDefaults(defaultParticleOptions, options);
    return world.addComponent(entity, ParticleId, component);
}
