import { createComponentId } from '../../ecs/ecs-component.js';
import { formatEntity } from '../../ecs/entity.js';
import { Vec2 } from '../../math/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const linearDamperId = createComponentId('linear-damper');
/**
 * Attaches a {@link LinearDamperEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The (dedicated) entity to attach the damper component to.
 * @param options - Options for configuring the damper.
 * @returns The attached component, for further tuning or runtime changes.
 * @throws An error if `dampingCoefficient` is negative.
 */
export function addLinearDamperComponent(world, entity, options) {
    if (options.dampingCoefficient < 0) {
        throw new Error(`Unable to add linear damper to entity ${formatEntity(entity)}: dampingCoefficient must be >= 0.`);
    }
    const defaultOptions = {
        localAnchorA: Vec2.zero,
        localAnchorB: Vec2.zero,
    };
    const component = withDefaults(defaultOptions, options);
    return world.addComponent(entity, linearDamperId, component);
}
