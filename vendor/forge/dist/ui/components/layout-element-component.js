import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const layoutElementId = createComponentId('layoutElement');
const defaultLayoutElementOptions = {
    ignoreLayout: false,
};
/**
 * Attaches a {@link LayoutElementEcsComponent} to `entity`, overriding how
 * `createUiLayoutGroupEcsSystem` measures and (if `childControlWidth`/
 * `childControlHeight` is enabled on the parent group) resizes it. Every
 * field is optional - pass only the ones you need to override.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the layout element.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addLayoutElementComponent(world, entity, options = {}) {
    const component = withDefaults(defaultLayoutElementOptions, options);
    return world.addComponent(entity, layoutElementId, component);
}
