import { createComponentId } from '../../ecs/ecs-component.js';
export const inputsId = createComponentId('inputs');
/**
 * Attaches a {@link InputsEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the inputs. `inputManager` has no
 * sensible default and must always be provided.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addInputsComponent(world, entity, options) {
    return world.addComponent(entity, inputsId, { ...options });
}
