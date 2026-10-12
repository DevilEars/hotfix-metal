import { EcsSystem } from '../../ecs/ecs-system.js';
import { UiToggleEcsComponent } from '../components/ui-toggle-component.js';
import { UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
/**
 * Creates a system that flips a `UiToggleEcsComponent.isOn` whenever its
 * `UiInteractableEcsComponent.wasInvokedThisFrame` is `true` this tick - by a
 * pointer click or a submit action, whichever path raised it.
 * Toggles with no `group` flip freely, checkbox-style. Toggles sharing a
 * `group` behave as a radio group: turning one on turns off every other
 * toggle in the same group, and invoking the already-on toggle in a group
 * with `allowSwitchOff: false` (the default) is a no-op, since a radio group
 * always has exactly one selection.
 *
 * Must be registered after `createUiNavigationEcsSystem` and (if present)
 * `createUiInteractionEcsSystem`, since both write `wasInvokedThisFrame` for
 * this tick; `registerUiSystems` registers it that way.
 * @returns The UI toggle ECS system.
 */
export declare const createUiToggleEcsSystem: () => EcsSystem<[UiToggleEcsComponent, UiInteractableEcsComponent]>;
