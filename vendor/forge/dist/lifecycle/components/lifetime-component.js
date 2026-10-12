import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * The key of {@link LifetimeEcsComponent}.
 */
export const lifetimeId = createComponentId('lifetime');
const defaultLifetimeOptions = {
    elapsedSeconds: 0,
    hasExpired: false,
};
/**
 * Attaches a {@link LifetimeEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the lifetime. `durationSeconds`
 * has no sensible default and must always be provided.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addLifetimeComponent(world, entity, options) {
    const component = withDefaults(defaultLifetimeOptions, options);
    return world.addComponent(entity, lifetimeId, component);
}
