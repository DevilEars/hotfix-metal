import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const aspectRatioFitterId = createComponentId('aspectRatioFitter');
const defaultAspectRatioFitterOptions = {
    aspectMode: 'widthControlsHeight',
    aspectRatio: 1,
};
/**
 * Attaches an {@link AspectRatioFitterEcsComponent} to `entity`, so
 * `createUiAspectRatioFitterEcsSystem` keeps its
 * `RectTransformEcsComponent`'s own size at a constant `aspectRatio` every
 * frame - useful for a portrait/thumbnail image or a minimap whose
 * container might otherwise stretch it. `fitInParent`/`envelopeParent` read
 * the parent's own resolved `rect` (one frame stale, like every other
 * cross-entity read in this module - see `createUiLayoutEcsSystem`'s own
 * doc comment) - `entity` needs a parent for those two modes.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to. Assumes a
 * point-anchored `RectTransformEcsComponent` (its `x`/`y` are each a
 * literal size, not a stretch margin).
 * @param options - Options for configuring the fitter.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addAspectRatioFitterComponent(world, entity, options = {}) {
    const component = withDefaults(defaultAspectRatioFitterOptions, options);
    return world.addComponent(entity, aspectRatioFitterId, component);
}
