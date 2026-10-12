import { createComponentId } from '../../ecs/ecs-component.js';
import { Vec2 } from '../../math/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const maskId = createComponentId('mask');
/**
 * Attaches a {@link MaskEcsComponent} to `entity`, clipping its sprites and
 * text and those of its descendants.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the mask. `width` and `height`
 * have no sensible default and must always be provided. `pivot` and `shape`
 * are copied, so systems can write them in place.
 * @returns The attached component, for runtime changes (e.g. writing
 * `shape.amount`).
 */
export function addMaskComponent(world, entity, options) {
    const defaultMaskOptions = {
        pivot: { x: 0.5, y: 0.5 },
        shape: { kind: 'rect' },
    };
    const component = withDefaults(defaultMaskOptions, options);
    component.pivot = Vec2.clone(component.pivot);
    component.shape = { ...component.shape };
    return world.addComponent(entity, maskId, component);
}
