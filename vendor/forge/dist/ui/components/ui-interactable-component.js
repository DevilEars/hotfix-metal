import { createComponentId } from '../../ecs/ecs-component.js';
import { ForgeEvent } from '../../events/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiInteractableId = createComponentId('uiInteractable');
const defaultUiInteractableOptions = {
    interactable: true,
    blocksRaycasts: true,
    dragThreshold: 8,
    receivesDrag: false,
    focusable: true,
};
/**
 * Attaches a {@link UiInteractableEcsComponent} to `entity`. Needs a
 * `RectTransformEcsComponent` on the same entity (or a parent chain
 * resolving to one) for `createUiRaycastEcsSystem` to hit-test against; use
 * `createButton` for the common "clickable rect with a label" case.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the interactable.
 * @returns The attached component, for further tuning, listening to its
 * events, or reading its interaction state.
 */
export function addUiInteractableComponent(world, entity, options = {}) {
    const component = {
        ...withDefaults(defaultUiInteractableOptions, options),
        onInvoke: new ForgeEvent('uiInteractable.onInvoke'),
        onPointerEnter: new ForgeEvent('uiInteractable.onPointerEnter'),
        onPointerExit: new ForgeEvent('uiInteractable.onPointerExit'),
        onPointerDown: new ForgeEvent('uiInteractable.onPointerDown'),
        onPointerUp: new ForgeEvent('uiInteractable.onPointerUp'),
        onBeginDrag: new ForgeEvent('uiInteractable.onBeginDrag'),
        onDrag: new ForgeEvent('uiInteractable.onDrag'),
        onEndDrag: new ForgeEvent('uiInteractable.onEndDrag'),
        isHovered: false,
        isFocused: false,
        isPressed: false,
        isDragging: false,
        wasInvokedThisFrame: false,
        pressCapture: null,
    };
    return world.addComponent(entity, uiInteractableId, component);
}
