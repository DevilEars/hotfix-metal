import { addPositionComponent } from '../../common/index.js';
import { addTextComponent, textVerticalAlignments, } from '../../text/index.js';
import { addLayoutElementComponent } from '../components/layout-element-component.js';
import { addRectTransformComponent } from '../components/rect-transform-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const defaultCreateLabelOptions = {
    anchor: UiAnchor.center(),
};
/**
 * Creates a UI label: an entity with a `RectTransformEcsComponent` (parented
 * to `parent`) and a `TextEcsComponent`. Every `TextEcsComponent` option
 * (`text`, `fontAtlas`, `size`, and the rest) is accepted directly. `category`
 * is not defaulted here - omitted, it falls through to `TextEcsComponent`'s
 * own default (`TEXT_RENDER_CATEGORY`), which has nothing to do with any
 * particular canvas's culling mask. To make a label visible through a
 * specific `createUiCanvas`, pass the same `category` value you gave that
 * canvas's `cullingMask` (see `ScreenSpaceUiCanvasOptions.cullingMask`
 * for why there's no shared default to fall back on).
 * @param world - The ECS world to create the label entity in.
 * @param parent - The entity to parent the label to - required, no default.
 * There's no standalone "no parent" case: pass the canvas entity itself
 * (see `createUiCanvas`) for a top-level label, or another UI element (a
 * panel, a button) to position the label relative to it, the way `createButton`
 * parents its own label to the button rather than to the canvas directly.
 * @param options - Options for configuring the label. `text`, `fontAtlas`,
 * and `size` have no sensible default and must always be provided.
 * @returns The created label entity.
 */
export function createLabel(world, parent, options) {
    const { anchor, anchoredPosition, sizeToText, ...textOptions } = withDefaults({
        ...defaultCreateLabelOptions,
        ...(options.sizeToText && options.verticalAlign === undefined
            ? { verticalAlign: textVerticalAlignments.bottom }
            : {}),
    }, options);
    const entity = world.createEntity();
    addPositionComponent(world, entity);
    world.setParent(entity, parent);
    addRectTransformComponent(world, entity, {
        ...anchor,
        anchoredPosition,
    });
    addTextComponent(world, entity, textOptions);
    if (sizeToText) {
        addLayoutElementComponent(world, entity, { sizeToText: true });
    }
    return entity;
}
