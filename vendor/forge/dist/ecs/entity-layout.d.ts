export declare const entityIndexBits = 20;
export declare const entityIndexMask: number;
export declare const entityGenerationMask: number;
/**
 * The number of entity slots a world can hold at once.
 */
export declare const maxEntities: number;
/**
 * Packs a slot index and a generation into an entity handle. The generation
 * wraps after 1,023.
 * @param index - The entity's slot index, below {@link maxEntities}.
 * @param generation - The slot's generation.
 * @returns The entity handle.
 */
export declare const createEntityHandle: (index: number, generation: number) => number;
