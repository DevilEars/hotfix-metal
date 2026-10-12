import { createComponentId } from '../../ecs/ecs-component.js';
import { Vec2 } from '../../math/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const rigidBodyId = createComponentId('f-rigid-body');
/**
 * Attaches a {@link RigidBodyEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the rigid body.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addRigidBodyComponent(world, entity, options = {}) {
    const defaultRigidBodyOptions = {
        velocity: Vec2.zero,
        angularVelocity: 0,
        angularDrag: 0,
        type: 'dynamic',
    };
    const component = withDefaults(defaultRigidBodyOptions, options);
    return world.addComponent(entity, rigidBodyId, component);
}
