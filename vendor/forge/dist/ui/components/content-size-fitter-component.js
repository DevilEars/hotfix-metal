import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const contentSizeFitterId = createComponentId('contentSizeFitter');
const defaultContentSizeFitterOptions = {
    horizontalFit: 'unconstrained',
    verticalFit: 'unconstrained',
};
/**
 * Attaches a {@link ContentSizeFitterEcsComponent} to `entity`, resizing its
 * `RectTransformEcsComponent`'s own size every frame (via
 * `createUiLayoutGroupEcsSystem`, alongside its layout-group handling) to
 * match `entity`'s own measured content size on each configured axis - the
 * same min/preferred size a `UiAxisLayoutGroupEcsComponent`/
 * `GridLayoutGroupEcsComponent` on `entity` would report to a parent group, or `entity`'s own
 * `LayoutElementEcsComponent` overrides. With neither, there's no content to
 * measure and this is a no-op - pair it with one of those, most commonly a
 * layout group, to make a panel shrink-wrap its arranged children.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to. Assumes a
 * point-anchored `RectTransformEcsComponent` (its `x`/`y` are each a
 * literal size, not a stretch margin).
 * @param options - Options for configuring the fitter.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addContentSizeFitterComponent(world, entity, options = {}) {
    const component = withDefaults(defaultContentSizeFitterOptions, options);
    return world.addComponent(entity, contentSizeFitterId, component);
}
