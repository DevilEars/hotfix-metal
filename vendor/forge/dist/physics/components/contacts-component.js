import { createComponentId } from '../../ecs/ecs-component.js';
export const contactsId = createComponentId('contacts');
/**
 * Attaches an empty {@link ContactsEcsComponent} to `entity`, so
 * `createNarrowPhaseEcsSystem` records what its collider touches.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @returns The attached component, for reading its contacts later.
 */
export function addContactsComponent(world, entity) {
    const component = {
        touching: [],
        started: [],
        ended: [],
    };
    return world.addComponent(entity, contactsId, component);
}
