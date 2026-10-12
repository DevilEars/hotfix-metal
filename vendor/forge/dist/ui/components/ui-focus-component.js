import { createComponentId } from '../../ecs/ecs-component.js';
export const uiFocusId = createComponentId('uiFocus');
/**
 * Attaches a {@link UiFocusEcsComponent} to `entity`, overriding
 * `createUiNavigationEcsSystem`'s automatic nearest-neighbor search on
 * whichever sides are given. Needs a `UiInteractableEcsComponent` on the
 * same entity to be reachable by navigation in the first place.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - The directional overrides to set. Sides left unset keep
 * the automatic search.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addUiFocusComponent(world, entity, options = {}) {
    return world.addComponent(entity, uiFocusId, { ...options });
}
