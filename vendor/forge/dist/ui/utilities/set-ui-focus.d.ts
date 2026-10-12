import { EcsWorld } from '../../ecs/ecs-world.js';
import { CanvasEcsComponent } from '../components/canvas-component.js';
/**
 * Moves `canvas`'s focus to `entity` (or clears it, for `null`), keeping
 * `CanvasEcsComponent.focusedEntity` and the previous/next
 * `UiInteractableEcsComponent.isFocused` flags in sync. Shared by
 * `createUiNavigationEcsSystem` (directional navigation, `cancelInput`) and
 * `createUiInteractionEcsSystem` (the pointer hovering an element also
 * focuses it, so the highlight follows the mouse), so both focus paths
 * agree on what "focused" means.
 * @param world - The ECS world `canvas` and `entity` belong to.
 * @param canvas - The canvas whose focus is changing.
 * @param entity - The entity to focus, or `null` to clear focus.
 */
export declare function setUiFocus(world: EcsWorld, canvas: CanvasEcsComponent, entity: number | null): void;
