/**
 * Gets the slot index of an entity handle.
 * @param entity - The entity handle.
 * @returns The slot index.
 */
export declare const entityIndex: (entity: number) => number;
/**
 * Gets the generation of an entity handle.
 * @param entity - The entity handle.
 * @returns The generation.
 */
export declare const entityGeneration: (entity: number) => number;
/**
 * Formats an entity handle as its index and generation (e.g. `"12v3"` for
 * index 12, generation 3), for error messages and debugging.
 * @param entity - The entity handle.
 * @returns The formatted handle.
 */
export declare const formatEntity: (entity: number) => string;
