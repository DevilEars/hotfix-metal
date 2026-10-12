import { addPositionComponent } from '../../common/index.js';
import { addSpriteComponent, } from '../../rendering/index.js';
import { addRectTransformComponent } from '../components/rect-transform-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const defaultCreatePanelOptions = {
    anchor: UiAnchor.center(),
};
/**
 * Creates a UI panel: an entity with a `RectTransformEcsComponent` (parented
 * to `parent`) and a `SpriteEcsComponent`. `createUiLayoutEcsSystem` drives
 * the sprite's `width`/`height`/`pivot` from the resolved rect
 * every frame - the panel always exactly fills its rect.
 * @param world - The ECS world to create the panel entity in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the panel. `sprite` has no
 * sensible default and must always be provided.
 * @returns The created panel entity.
 */
export function createPanel(world, parent, options) {
    const { anchor, anchoredPosition, sprite, slices } = withDefaults(defaultCreatePanelOptions, options);
    const entity = world.createEntity();
    addPositionComponent(world, entity);
    world.setParent(entity, parent);
    addRectTransformComponent(world, entity, {
        ...anchor,
        anchoredPosition,
    });
    addSpriteComponent(world, entity, {
        ...sprite,
        slices: slices ?? sprite.slices,
    });
    return entity;
}
