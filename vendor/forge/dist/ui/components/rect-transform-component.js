import { createComponentId } from '../../ecs/ecs-component.js';
import { Rects, Vec2 } from '../../math/index.js';
import { UiAxis } from '../types/ui-axis.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const rectTransformId = createComponentId('rectTransform');
/**
 * Attaches a {@link RectTransformEcsComponent} to `entity`. Every UI
 * element - including a `CanvasEcsComponent`'s own root entity - has one;
 * `createUiLayoutEcsSystem` resolves it against its parent's rect (or, for a
 * canvas root, the canvas's reference resolution) every frame.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the rect transform. See
 * `UiAnchor` for common `x`/`y` presets.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addRectTransformComponent(world, entity, options = {}) {
    const defaultRectTransformOptions = {
        x: UiAxis.point(0.5),
        y: UiAxis.point(0.5),
        anchoredPosition: Vec2.zero,
        rect: Rects.zero,
    };
    const merged = withDefaults(defaultRectTransformOptions, options);
    const component = {
        // `x`/`y` are shallow-cloned (rather than referenced directly) since a
        // `UiAnchor` preset value can be reused across several
        // `addRectTransformComponent` calls - cloning means one entity's later
        // in-place axis mutation (e.g. a slider dragging its handle) can never
        // corrupt another entity built from the same preset value. `Vector2`s
        // are cloned for the same reason.
        x: { ...merged.x },
        y: { ...merged.y },
        anchoredPosition: Vec2.clone(merged.anchoredPosition),
        rect: Rects.clone(merged.rect),
    };
    return world.addComponent(entity, rectTransformId, component);
}
