import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const canvasGroupId = createComponentId('canvasGroup');
const defaultCanvasGroupOptions = {
    alpha: 1,
    interactable: true,
    blocksRaycasts: true,
    ignoreParentGroups: false,
};
/**
 * Attaches a {@link CanvasGroupEcsComponent} to `entity`. Read by
 * `resolveCanvasGroupState` and applied by `createUiCanvasGroupEcsSystem`
 * (alpha) and by `createUiRaycastEcsSystem`/`createUiInteractionEcsSystem`/
 * `createUiNavigationEcsSystem` (interactable/blocksRaycasts) to every UI
 * descendant of `entity` - a whole panel, modal, or HUD section can be
 * faded, disabled, or made click-through with one component instead of one
 * per element.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the canvas group.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addCanvasGroupComponent(world, entity, options = {}) {
    const component = withDefaults(defaultCanvasGroupOptions, options);
    return world.addComponent(entity, canvasGroupId, component);
}
