/**
 * Creates a named system group to register with `EcsWorld.addSystemGroup`.
 * @param name - A human-readable name, used to identify the group in error messages.
 * @returns The system group.
 */
export const createSystemGroup = (name) => ({ name });
