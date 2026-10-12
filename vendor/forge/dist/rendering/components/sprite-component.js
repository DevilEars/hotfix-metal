import { createComponentId } from '../../ecs/ecs-component.js';
import { Vec2 } from '../../math/index.js';
import { Color } from '../color.js';
import { resolveNineSliceNativeSize, } from '../nine-slice-options.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/** The component key of {@link SpriteEcsComponent}. */
export const spriteId = createComponentId('sprite');
/**
 * Attaches a {@link SpriteEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the sprite. `width`, `height`,
 * and `texture` have no sensible default and must always be provided.
 * `pivot`, `uvOffset`, `uvScale` and `slices` are copied, so the component
 * never shares them with `options` or with other sprites built from the same
 * options. If `slices` is set, any omitted `nativeWidth`/`nativeHeight` is
 * captured from `width`/`height` here, before anything can resize the
 * sprite.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addSpriteComponent(world, entity, options) {
    const defaultSpriteOptions = {
        pivot: { x: 0.5, y: 0.5 },
        tintColor: Color.white,
        uvOffset: Vec2.zero,
        uvScale: Vec2.one,
        emissive: null,
        material: null,
        category: 1,
        layer: 0,
    };
    const component = withDefaults(defaultSpriteOptions, options);
    // Systems write these vectors in place per entity (the sprite animation
    // system writes each entity's frame into `uvOffset`, UI layout writes
    // `pivot`), so every component gets its own copies, however `options`
    // was built: sprites created from one shared options object must never
    // share a frame or pivot.
    component.pivot = Vec2.clone(component.pivot);
    component.uvOffset = Vec2.clone(component.uvOffset);
    component.uvScale = Vec2.clone(component.uvScale);
    if (component.slices) {
        component.slices = resolveNineSliceNativeSize(component.slices, component.width, component.height);
    }
    return world.addComponent(entity, spriteId, component);
}
