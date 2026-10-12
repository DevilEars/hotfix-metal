import { createComponentId } from '../../ecs/ecs-component.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
import { Rects, Vec2 } from '../../math/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiScrollRectId = createComponentId('uiScrollRect');
const defaultUiScrollRectOptions = {
    horizontal: true,
    vertical: true,
    movementType: 'elastic',
    elasticity: 0.1,
    decelerationRate: 0.135,
};
/**
 * Attaches a {@link UiScrollRectEcsComponent} to `entity`, the scroll rect's
 * viewport. Needs a `UiInteractableEcsComponent` and a
 * `RectTransformEcsComponent` on the same entity for
 * `createUiScrollRectEcsSystem` to process it.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the scroll rect. `content` has
 * no sensible default and must always be provided.
 * @returns The attached component, for reading or writing `offset`, or
 * listening to `onValueChanged`.
 */
export function addUiScrollRectComponent(world, entity, options) {
    const { horizontalScrollbar, verticalScrollbar, offset, ...rest } = withDefaults(defaultUiScrollRectOptions, options);
    const component = {
        ...rest,
        offset: offset ? Vec2.clone(offset) : Vec2.zero,
        ...(horizontalScrollbar && {
            horizontalScrollbar: { ...horizontalScrollbar, grabOffset: null },
        }),
        ...(verticalScrollbar && {
            verticalScrollbar: { ...verticalScrollbar, grabOffset: null },
        }),
        velocity: Vec2.zero,
        dragOrigin: null,
        lastFocusedEntity: null,
        onValueChanged: new ParameterizedForgeEvent('uiScrollRect.onValueChanged'),
    };
    return world.addComponent(entity, uiScrollRectId, component);
}
/**
 * How far content can scroll on each axis: how much wider and taller it is
 * than the viewport, or `0` on an axis it fits.
 * @param viewport - The scroll rect's resolved rect.
 * @param content - The content's resolved rect.
 * @returns The hidden width (`x`) and height (`y`), in reference pixels.
 */
export function computeUiScrollRange(viewport, content) {
    const viewportSize = Rects.size(viewport);
    const contentSize = Rects.size(content);
    return {
        x: Math.max(0, contentSize.x - viewportSize.x),
        y: Math.max(0, contentSize.y - viewportSize.y),
    };
}
/**
 * Converts a scroll rect's `offset` to a `0`-`1` position on each axis:
 * `x` `0` at the left edge and `1` at the right, `y` `1` at the top and `0`
 * at the bottom (Y-up). Outside `0`-`1` while elastic content is pulled
 * past an edge. On an axis the content fits, `x` is `0` and `y` is `1`.
 * @param offset - The scroll rect's `offset`.
 * @param range - The scroll range, from {@link computeUiScrollRange}.
 * @returns The normalized position.
 */
export function normalizeUiScrollOffset(offset, range) {
    return {
        x: range.x > 0 ? (0 - offset.x) / range.x : 0,
        y: range.y > 0 ? 1 - offset.y / range.y : 1,
    };
}
/**
 * Converts a `0`-`1` position (see {@link normalizeUiScrollOffset}) back to
 * an `offset`.
 * @param normalizedPosition - The normalized position.
 * @param range - The scroll range, from {@link computeUiScrollRange}.
 * @returns The offset.
 */
export function denormalizeUiScrollOffset(normalizedPosition, range) {
    return {
        x: 0 - normalizedPosition.x * range.x,
        y: (1 - normalizedPosition.y) * range.y,
    };
}
