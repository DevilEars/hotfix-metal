import { addPositionComponent } from '../../common/index.js';
import { addVisibilityComponent, Color, } from '../../rendering/index.js';
import { textHorizontalAlignments, textId } from '../../text/index.js';
import { addRectTransformComponent } from '../components/rect-transform-component.js';
import { addUiDropdownComponent, } from '../components/ui-dropdown-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { UiAxis, uiAxisValue } from '../types/ui-axis.js';
import { createButton } from './create-button.js';
import { createLabel } from './create-label.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * The anchor every option row shares: full header width, hanging down from
 * the header's bottom edge. `height` sets each row's height - a literal
 * size, since the row is point-anchored vertically.
 */
const optionRowAnchor = (height) => ({
    x: UiAxis.stretch({ min: 0, max: 1 }),
    y: UiAxis.point(0, { pivot: 1, size: height }),
});
/**
 * The chevron glyph shown while the option list is closed/open,
 * respectively. The bundled default font atlas only covers ASCII, so these
 * stand in for a down/up-pointing triangle rather than proper chevron
 * glyphs (e.g. `▼`/`▲`), which it doesn't have.
 */
const chevronClosedText = 'v';
const chevronOpenText = '^';
/**
 * Creates a dropdown: a header button (see `createButton`) showing the
 * currently selected option and a chevron indicator on its right edge, with
 * a `UiDropdownEcsComponent` added, plus one option-row button per entry in
 * `options`, stacked below the header in a `list` container that's hidden
 * (see `VisibilityEcsComponent`) until the header is clicked open. Selecting an option updates the header's label, raises
 * `onValueChanged`, and closes the list. The chevron flips between
 * `chevronClosedText` and `chevronOpenText` in step with `dropdown.isOpen`.
 *
 * **Known limitation**: clicking outside the open list doesn't close it -
 * only clicking the header again or selecting an option does. Register your
 * own listener (e.g. on a full-canvas click-catcher, gated on
 * `dropdown.isOpen`) if your game needs that.
 * @param world - The ECS world to create the dropdown entity in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the dropdown. `headerSprite`,
 * `optionSprite`, `options`, and `fontAtlas` have no sensible default and
 * must always be provided.
 * @returns The created dropdown: its header entity/button, its option row
 * buttons and their list container, its chevron label entity, its `UiDropdownEcsComponent`, and
 * `onValueChanged` for the common case of registering a single listener.
 */
export function createDropdown(world, parent, options) {
    const defaultCreateDropdownOptions = {
        anchor: UiAnchor.topLeft({ x: 240, y: 56 }),
        selectedIndex: 0,
        labelSize: 24,
        labelColor: Color.black,
    };
    const { anchor, anchoredPosition, headerSprite, optionSprite, slices, options: optionLabels, fontAtlas, selectedIndex, labelSize, labelColor, labelCategory, optionHeight, interactable: interactableOptions, transition: transitionOptions, } = withDefaults(defaultCreateDropdownOptions, options);
    const headerWidth = uiAxisValue(anchor.x);
    const resolvedOptionHeight = optionHeight ?? uiAxisValue(anchor.y);
    // Reserves room on the header's right edge for the chevron, so the
    // selected-option label (`createButton`'s own centered label, `maxWidth`
    // otherwise defaulting to the header's full width) doesn't overlap it.
    const chevronReservedWidth = labelSize * 1.5;
    const header = createButton(world, parent, {
        anchor,
        anchoredPosition,
        labelMaxWidth: headerWidth - chevronReservedWidth,
        sprite: headerSprite,
        slices,
        label: optionLabels[selectedIndex],
        fontAtlas,
        labelSize,
        labelColor,
        labelCategory,
        interactable: interactableOptions,
        transition: transitionOptions,
    });
    const dropdown = addUiDropdownComponent(world, header.entity, {
        options: optionLabels,
        selectedIndex,
    });
    const chevron = createLabel(world, header.entity, {
        text: chevronClosedText,
        fontAtlas,
        size: labelSize,
        anchor: UiAnchor.middleRight(),
        anchoredPosition: { x: -chevronReservedWidth / 2, y: 0 },
        horizontalAlign: textHorizontalAlignments.center,
        verticalAlign: 'middle',
        color: labelColor,
        category: labelCategory,
    });
    const chevronText = world.getComponentRequired(chevron, textId);
    // One container for every row, so opening and closing the list is a
    // single visibility write. It covers the header's rect, so the rows hang
    // from the header's bottom edge as if they were parented to it directly.
    const list = world.createEntity();
    addPositionComponent(world, list);
    world.setParent(list, header.entity);
    addRectTransformComponent(world, list, UiAnchor.stretchAll());
    const listVisibility = addVisibilityComponent(world, list, {
        visible: false,
    });
    const optionButtons = optionLabels.map((label, index) => createButton(world, list, {
        anchor: optionRowAnchor(resolvedOptionHeight),
        anchoredPosition: { x: 0, y: -resolvedOptionHeight * index },
        // `optionRowAnchor` stretches each row to the header's full width with
        // a zero margin, so the row's actual rendered width is the header's
        // own width, not its own - `createButton` can't derive that from a
        // stretched button's own options alone (see `labelMaxWidth`'s doc
        // comment).
        labelMaxWidth: headerWidth,
        sprite: optionSprite,
        slices,
        label,
        fontAtlas,
        labelSize,
        labelColor,
        labelCategory,
        interactable: interactableOptions,
        transition: transitionOptions,
    }));
    const headerLabelText = world.getComponentRequired(header.label, textId);
    const setOpen = (isOpen) => {
        dropdown.isOpen = isOpen;
        chevronText.text = isOpen ? chevronOpenText : chevronClosedText;
        listVisibility.visible = isOpen;
    };
    header.onInvoke.registerListener(() => setOpen(!dropdown.isOpen));
    optionButtons.forEach((optionButton, index) => {
        optionButton.onInvoke.registerListener(() => {
            dropdown.selectedIndex = index;
            headerLabelText.text = optionLabels[index];
            dropdown.onValueChanged.raise(index);
            setOpen(false);
        });
    });
    setOpen(false);
    return {
        entity: header.entity,
        header,
        list,
        options: optionButtons,
        chevron,
        dropdown,
        onValueChanged: dropdown.onValueChanged,
    };
}
