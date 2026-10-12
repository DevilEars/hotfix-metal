import { uiToggleId, } from '../components/ui-toggle-component.js';
import { uiToggleGroupId } from '../components/ui-toggle-group-component.js';
import { uiInteractableId, } from '../components/ui-interactable-component.js';
/** Sets `toggle.isOn` and raises `onValueChanged` if the value actually changed. */
function setToggleValue(toggle, isOn) {
    if (toggle.isOn === isOn) {
        return;
    }
    toggle.isOn = isOn;
    toggle.onValueChanged.raise(isOn);
}
/**
 * Turns off every other toggle sharing `group`, so turning one on leaves it
 * the only one on.
 */
function clearOtherToggles(world, group, keepOn) {
    const { entities, components: [toggles], } = world.query([uiToggleId]);
    for (let i = 0; i < entities.length; i++) {
        if (entities[i] !== keepOn && toggles[i].group === group) {
            setToggleValue(toggles[i], false);
        }
    }
}
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
export const createUiToggleEcsSystem = () => ({
    name: 'uiToggle',
    query: [uiToggleId, uiInteractableId],
    update: (world, { entities, components: [toggles, interactables] }) => {
        for (let i = 0; i < entities.length; i++) {
            const toggle = toggles[i];
            const interactable = interactables[i];
            if (!interactable.wasInvokedThisFrame) {
                continue;
            }
            if (toggle.group !== undefined) {
                const group = world.getComponent(toggle.group, uiToggleGroupId);
                if (toggle.isOn && !group?.allowSwitchOff) {
                    continue;
                }
                setToggleValue(toggle, !toggle.isOn);
                if (toggle.isOn) {
                    clearOtherToggles(world, toggle.group, entities[i]);
                }
                continue;
            }
            setToggleValue(toggle, !toggle.isOn);
        }
    },
});
