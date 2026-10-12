/**
 * A registry for assets that allows for registration of assets with string IDs and retrieval of numeric IDs.
 * This is useful for efficient storage and retrieval of assets while still allowing for human-readable identifiers.
 */
export declare class AssetRegistry<T> {
    private readonly _items;
    private readonly _stringToIdMap;
    /** Registers an asset with a string ID and returns its numeric ID.
     * @param stringId - The human-readable string ID for the asset.
     * @param item - The asset to register.
     * @returns The numeric ID assigned to the registered asset.
     * @throws Error if the string ID is already registered in the registry.
     */
    register(stringId: string, item: T): number;
    /** Retrieves the numeric ID associated with a given string ID.
     * @param stringId - The string ID of the asset to retrieve.
     * @returns The numeric ID associated with the provided string ID.
     * @throws Error if the string ID is not found in the registry.
     */
    getId(stringId: string): number;
    /** Retrieves an asset directly by its numeric ID.
     * @param numericId - The numeric ID of the asset to retrieve.
     * @returns The asset associated with the provided numeric ID.
     * @throws Error if the numeric ID is out of bounds.
     */
    getDirect(numericId: number): T;
}
