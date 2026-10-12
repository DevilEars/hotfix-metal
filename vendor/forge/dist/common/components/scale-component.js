import { Vec2 } from '../../math/index.js';
import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const scaleId = createComponentId('scale');
/**
 * Attaches a {@link ScaleEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the scale.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addScaleComponent(world, entity, options = {}) {
    // `local` defaults to a fresh Vector2 per call (rather than a shared
    // module-level default) since systems mutate it in place.
    const defaultScaleOptions = {
        local: Vec2.one,
    };
    const scaleOptions = withDefaults(defaultScaleOptions, options);
    return world.addComponent(entity, scaleId, {
        ...scaleOptions,
        world: Vec2.clone(scaleOptions.local),
    });
}
