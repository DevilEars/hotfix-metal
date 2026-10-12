import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * A collision mask with every bit set: a collider (or ray) with this mask
 * accepts every category.
 */
export const allCollisionCategories = 0xffffffff;
export const colliderId = createComponentId('collider');
/**
 * Attaches a {@link ColliderEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - The collider shape, plus any options to override.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addColliderComponent(world, entity, options) {
    const defaultColliderOptions = {
        friction: 0.6,
        restitution: 0.05,
        category: 1,
        mask: allCollisionCategories,
        sensor: false,
    };
    const component = {
        ...withDefaults(defaultColliderOptions, options),
        aabb: {
            min: { x: Infinity, y: Infinity },
            max: { x: -Infinity, y: -Infinity },
        },
    };
    return world.addComponent(entity, colliderId, component);
}
