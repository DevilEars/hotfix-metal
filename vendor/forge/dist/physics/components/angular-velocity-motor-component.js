import { createComponentId } from '../../ecs/ecs-component.js';
export const angularVelocityMotorId = createComponentId('angular-velocity-motor');
/**
 * Attaches an {@link AngularVelocityMotorEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to; must already have
 * a `RigidBodyEcsComponent`.
 * @param options - Options for configuring the motor.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addAngularVelocityMotorComponent(world, entity, options) {
    const component = { ...options };
    return world.addComponent(entity, angularVelocityMotorId, component);
}
