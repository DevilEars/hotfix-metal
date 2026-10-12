import { createComponentId } from '../../ecs/ecs-component.js';
import { Color } from '../../rendering/color.js';
import { textHorizontalAlignments, textVerticalAlignments, } from '../types/text-alignment.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * The default rendering category a text entity's glyphs are drawn with when
 * `TextEcsComponent.category` isn't overridden, matched against each
 * camera's `cullingMask`. The same default as `SpriteEcsComponent.category`.
 * Not reserved or forced - it's a default like any other.
 */
export const TEXT_RENDER_CATEGORY = 1;
/** The component key of {@link TextEcsComponent}. */
export const textId = createComponentId('text');
/**
 * Attaches a {@link TextEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the text. `text`, `fontAtlas`,
 * and `size` have no sensible default and must always be provided.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addTextComponent(world, entity, options) {
    const defaultTextOptions = {
        color: Color.white,
        letterSpacing: 0,
        lineHeight: 1,
        horizontalAlign: textHorizontalAlignments.left,
        verticalAlign: textVerticalAlignments.top,
        horizontalAlignPivot: 0,
        richText: true,
        layer: 0,
        category: TEXT_RENDER_CATEGORY,
        outlineColor: Color.black,
        outlineWidth: 0,
        shadowColor: Color.transparent,
        shadowOffset: { x: 0, y: 0 },
        shadowSoftness: 0,
    };
    const component = withDefaults(defaultTextOptions, options);
    return world.addComponent(entity, textId, component);
}
