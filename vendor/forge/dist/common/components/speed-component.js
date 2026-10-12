import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const speedId = createComponentId('speed');
const defaultSpeedOptions = {
    speed: 0,
};
/**
 * Attaches a {@link SpeedEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the speed.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addSpeedComponent(world, entity, options = {}) {
    const component = withDefaults(defaultSpeedOptions, options);
    return world.addComponent(entity, speedId, component);
}
