/**
 * A sparse set implementation for efficient storage of components in an ECS architecture.
 * The sparse array is indexed by each entity handle's slot index, and the dense
 * array holds full handles, so a handle to a removed entity (same slot, older
 * generation) is never a member, even once a new entity has taken its slot.
 */
export declare class SparseSet<T> {
    readonly sparseArray: Array<number>;
    readonly denseEntities: Array<number>;
    readonly denseComponents: Array<T>;
    readonly isTag: boolean;
    /**
     * Creates a new SparseSet instance.
     * @param isTag - Indicates whether the set is a tag component (default: false).
     */
    constructor(isTag?: boolean);
    /**
     * Checks if the set contains a component for the specified entity.
     * @param entity - The entity handle to check.
     * @returns True if the entity has a component in the set, false otherwise.
     */
    has(entity: number): boolean;
    /**
     * Gets the component for the specified entity.
     * @param entity - The entity handle to get the component for.
     * @returns The component if the entity has one in the set, null otherwise.
     */
    get(entity: number): T | null;
    /**
     * Adds a component for the specified entity.
     * @param entity - The entity handle to add the component for.
     * @param component - The component to add.
     */
    add(entity: number, component: T): void;
    /**
     * Removes the component for the specified entity.
     * @param entity - The entity handle to remove the component for.
     */
    remove(entity: number): void;
    get size(): number;
}
