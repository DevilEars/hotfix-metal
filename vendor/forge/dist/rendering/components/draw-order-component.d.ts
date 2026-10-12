import { EcsWorld } from '../../ecs/ecs-world.js';
/**
 * The largest `DrawOrderEcsComponent.order` magnitude. Bounding each
 * entity's own order keeps the sum down any realistic hierarchy an exact
 * 32-bit integer.
 */
export declare const maxDrawOrder = 4096;
/**
 * Moves an entity, and everything parented under it, forwards or backwards
 * in the draw order of its sprite and text layer. An entity without one has
 * an order of `0`.
 *
 * Orders are relative: an entity's world order is its own `order` plus its
 * parent's world order. Within a layer, a lower world order draws first,
 * and entities with the same world order draw in hierarchy order (parents
 * before their children, siblings in the order they were parented). So a
 * child at `-1` draws behind every entity at its parent's level, not just
 * behind its parent. To draw a child just behind its parent, set
 * `behindParent` instead.
 */
export interface DrawOrderEcsComponent {
    /**
     * An integer in `[-maxDrawOrder, maxDrawOrder]`, added to the parent's
     * world order.
     */
    order: number;
    /**
     * Whether the entity, with everything parented under it, comes just
     * before its parent in hierarchy order instead of after it, so it draws
     * behind its parent and in front of whatever its parent draws in front
     * of. Siblings that set it keep their sibling order among themselves. It
     * has no effect on an entity without a parent.
     */
    behindParent: boolean;
}
/** The component key of {@link DrawOrderEcsComponent}. */
export declare const drawOrderId: import("../../ecs/ecs-component.js").ComponentKey<DrawOrderEcsComponent>;
/**
 * Attaches a {@link DrawOrderEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the draw order.
 * @returns The attached component, for further tuning or runtime changes.
 * @throws An error if `order` isn't an integer in
 * `[-maxDrawOrder, maxDrawOrder]`.
 */
export declare function addDrawOrderComponent(world: EcsWorld, entity: number, options?: Partial<DrawOrderEcsComponent>): DrawOrderEcsComponent;
