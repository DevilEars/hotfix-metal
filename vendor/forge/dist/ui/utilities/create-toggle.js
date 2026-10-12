import { addVisibilityComponent, } from '../../rendering/index.js';
import { addUiColorTransitionComponent, } from '../components/ui-color-transition-component.js';
import { addUiInteractableComponent, } from '../components/ui-interactable-component.js';
import { addUiToggleComponent, } from '../components/ui-toggle-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { createPanel } from './create-panel.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * Creates a toggle: a panel (see `createPanel`) with a
 * `UiInteractableEcsComponent`, a `UiColorTransitionEcsComponent`, and a
 * `UiToggleEcsComponent` added, plus a child checkmark panel whose
 * `VisibilityEcsComponent.visible` tracks `isOn`. Place a caption next to it with
 * a separate `createLabel` call - unlike `createButton`, a toggle doesn't
 * assemble one itself, since a caption's placement (left, right, above) and
 * whether one exists at all varies more than a button's centered label does.
 * @param world - The ECS world to create the toggle entity in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the toggle. `sprite` and
 * `checkmarkSprite` have no sensible default and must always be provided.
 * @returns The created toggle: its entity, its child checkmark entity, its
 * `UiInteractableEcsComponent`, its `UiToggleEcsComponent`, and
 * `onValueChanged` for the common case of registering a single listener.
 */
export function createToggle(world, parent, options) {
    const defaultCreateToggleOptions = {
        anchor: UiAnchor.center({ x: 32, y: 32 }),
        isOn: false,
    };
    const { anchor, anchoredPosition, sprite, slices, checkmarkSprite, isOn, group, interactable: interactableOptions, transition: transitionOptions, } = withDefaults(defaultCreateToggleOptions, options);
    const entity = createPanel(world, parent, {
        anchor,
        anchoredPosition,
        sprite,
        slices,
    });
    const interactable = addUiInteractableComponent(world, entity, interactableOptions);
    addUiColorTransitionComponent(world, entity, transitionOptions);
    const toggle = addUiToggleComponent(world, entity, {
        isOn,
        group,
    });
    const checkmark = createPanel(world, entity, {
        // `UiAnchor.stretchAll()`'s default margin is zero on both axes, so the
        // checkmark exactly fills the box it's meant to cover.
        anchor: UiAnchor.stretchAll(),
        sprite: checkmarkSprite,
    });
    const checkmarkVisibility = addVisibilityComponent(world, checkmark, {
        visible: isOn,
    });
    toggle.onValueChanged.registerListener((value) => {
        checkmarkVisibility.visible = value;
    });
    return {
        entity,
        checkmark,
        interactable,
        toggle,
        onValueChanged: toggle.onValueChanged,
    };
}
