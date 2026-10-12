import { Vec2 } from '../../math/index.js';
import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const positionId = createComponentId('position');
/**
 * Attaches a {@link PositionEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the position.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addPositionComponent(world, entity, options = {}) {
    // `local` defaults to a fresh Vector2 per call (rather than a shared
    // module-level default) since systems mutate it in place.
    const defaultPositionOptions = {
        local: Vec2.zero,
    };
    const positionOptions = withDefaults(defaultPositionOptions, options);
    return world.addComponent(entity, positionId, {
        ...positionOptions,
        world: Vec2.clone(positionOptions.local),
    });
}
