/**
 * Creates the key for a component type.
 * @param name - The component's name, shown in error messages.
 * @returns A new, unique component key.
 */
export function createComponentId(name) {
    return Symbol(name);
}
/**
 * Creates the key for a tag. Add a tag with `EcsWorld.addTag` and remove
 * it with `EcsWorld.removeComponent`.
 * @param name - The tag's name, shown in error messages.
 * @returns A new, unique tag key.
 */
export function createTagId(name) {
    return Symbol(name);
}
