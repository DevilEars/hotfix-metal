import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const ageScaleId = createComponentId('ageScale');
// Defaults to no scale change over the entity's lifetime (original and
// final scale both 1).
const defaultAgeScaleOptions = {
    originalScaleX: 1,
    originalScaleY: 1,
    finalLifetimeScaleX: 1,
    finalLifetimeScaleY: 1,
};
/**
 * Attaches a {@link AgeScaleEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the age-based scaling.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addAgeScaleComponent(world, entity, options = {}) {
    const component = withDefaults(defaultAgeScaleOptions, options);
    return world.addComponent(entity, ageScaleId, component);
}
