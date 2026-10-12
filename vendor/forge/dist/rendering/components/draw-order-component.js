import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * The largest `DrawOrderEcsComponent.order` magnitude. Bounding each
 * entity's own order keeps the sum down any realistic hierarchy an exact
 * 32-bit integer.
 */
export const maxDrawOrder = 4096;
/** The component key of {@link DrawOrderEcsComponent}. */
export const drawOrderId = createComponentId('drawOrder');
const defaultDrawOrderOptions = {
    order: 0,
    behindParent: false,
};
/**
 * Attaches a {@link DrawOrderEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the draw order.
 * @returns The attached component, for further tuning or runtime changes.
 * @throws An error if `order` isn't an integer in
 * `[-maxDrawOrder, maxDrawOrder]`.
 */
export function addDrawOrderComponent(world, entity, options = {}) {
    const component = withDefaults(defaultDrawOrderOptions, options);
    if (!Number.isInteger(component.order) ||
        Math.abs(component.order) > maxDrawOrder) {
        throw new Error(`Unable to add a draw order of ${component.order}, it must be an integer from ${-maxDrawOrder} to ${maxDrawOrder}.`);
    }
    return world.addComponent(entity, drawOrderId, component);
}
