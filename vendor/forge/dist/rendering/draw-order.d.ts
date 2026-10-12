import { EcsWorld } from '../ecs/ecs-world.js';
/**
 * Each entity's place in the draw order, resolved from the hierarchy by
 * {@link createDrawOrderResolver}. Within a sprite or text `layer`, entities
 * draw by world order, then (for a camera that y-sorts) by their root's Y,
 * then by hierarchy order: roots in creation order, each with its subtree
 * after it in pre-order (parents before children, siblings in sibling
 * order), except that a child whose `DrawOrderEcsComponent.behindParent` is
 * `true` comes, with its own subtree, just before its parent.
 *
 * The same pass resolves which entities are visible in the hierarchy (see
 * `VisibilityEcsComponent`), so a system that draws them can skip the
 * hidden ones without walking each one's ancestors again.
 */
export interface DrawOrderResolver {
    /**
     * Resolves the draw order of every entity in `entityLists`, and of every
     * other entity in their roots' subtrees. Replaces the previous
     * resolution, so the readers below are only valid for these entities.
     * @param world - The ECS world the entities belong to.
     * @param entityLists - The entities to resolve.
     */
    resolve(world: EcsWorld, ...entityLists: (readonly number[])[]): void;
    /**
     * Reads an entity's world order: the sum of its own and its ancestors'
     * `DrawOrderEcsComponent.order`, clamped to a 32-bit integer.
     */
    worldOrder(entity: number): number;
    /**
     * Reads the creation sequence of an entity's topmost ancestor (or its
     * own, if it has no parent). An entity unparented with `removeParent`
     * goes back to its own creation sequence among the roots.
     */
    rootSequence(entity: number): number;
    /** Reads an entity's index in hierarchy order within its root's subtree. */
    hierarchyIndex(entity: number): number;
    /**
     * Reads the world Y of an entity's topmost ancestor, which y-sorting
     * orders its whole subtree by. `0` when that ancestor has no position.
     */
    rootY(entity: number): number;
    /**
     * Reads whether an entity is visible in the hierarchy: `false` if it or
     * any ancestor has `VisibilityEcsComponent.visible` set to `false`, the
     * same answer as `isVisibleInHierarchy`.
     */
    isVisible(entity: number): boolean;
}
/**
 * Creates a {@link DrawOrderResolver}. Each one keeps its own buffers, so a
 * system that resolves draw order every frame doesn't allocate.
 * @returns The resolver.
 */
export declare function createDrawOrderResolver(): DrawOrderResolver;
/**
 * Writes a number as two unsigned 32-bit integers that sort, high then low,
 * the same as the number: its 64-bit float bits, with negative numbers'
 * bits flipped and positive numbers' sign bit set. Exact for every finite
 * number.
 * @param value - The number to map.
 * @param high - The array to write the more significant half into.
 * @param low - The array to write the less significant half into.
 * @param index - The index to write at.
 */
export declare function writeSortableFloat64(value: number, high: Uint32Array, low: Uint32Array, index: number): void;
/**
 * Maps a number to an unsigned 32-bit integer with the same order, through
 * its 32-bit float bits: negative floats have their bits flipped and
 * positive ones their sign bit set. Exact for integers up to `2^24`.
 * @param value - The number to map.
 * @returns The sortable integer.
 */
export declare function float32ToSortableUint32(value: number): number;
/**
 * Maps a 32-bit signed integer to an unsigned one with the same order.
 * @param value - The integer to map.
 * @returns The sortable integer.
 */
export declare function int32ToSortableUint32(value: number): number;
/**
 * Sorts `count` items by unsigned 32-bit keys with a stable,
 * least-significant-digit-first radix sort, one byte at a time. A byte that
 * every item shares is skipped, so key parts that are all equal (every
 * sprite in layer `0`) cost almost nothing.
 * @param keyParts - One key array per part, most significant part first.
 * Item `i`'s key is `keyParts[0][i]`, then `keyParts[1][i]`, and so on.
 * @param count - The number of items.
 * @param order - A buffer for the result, at least `count` long.
 * @param scratch - A second buffer the sort swaps with, at least `count` long.
 * @returns Item indices in ascending key order, either `order` or `scratch`.
 */
export declare function radixSortByKeys(keyParts: readonly Uint32Array[], count: number, order: Uint32Array, scratch: Uint32Array): Uint32Array;
