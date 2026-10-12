import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const tooltipId = createComponentId('tooltip');
const defaultTooltipOptions = {
    showDelayMilliseconds: 400,
    hoverElapsedMilliseconds: 0,
};
/**
 * Attaches a {@link TooltipEcsComponent} to `entity`. `entity` also needs a
 * `UiInteractableEcsComponent` - `createUiTooltipEcsSystem` reads its
 * hover/focus state to decide when to show the tooltip.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the tooltip. `panel`
 * has no sensible default and must always be provided.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addTooltipComponent(world, entity, options) {
    const component = withDefaults(defaultTooltipOptions, options);
    return world.addComponent(entity, tooltipId, component);
}
