const rebuildOrder = [
    'texture',
    'renderTarget',
    'geometry',
];
// Every live GPU resource of each render context, as the callbacks that
// rebuild it. Kept in a module of its own, which the package doesn't export,
// so only the engine's own resource classes register and only the render
// context rebuilds them. A strong reference, until the resource is disposed:
// a resource nobody disposed is still rebuilt, the same as it still holds
// GPU memory.
const gpuResourcesByContext = new WeakMap();
function getGpuResources(renderContext) {
    let resources = gpuResourcesByContext.get(renderContext);
    if (!resources) {
        resources = {
            texture: new Set(),
            renderTarget: new Set(),
            geometry: new Set(),
        };
        gpuResourcesByContext.set(renderContext, resources);
    }
    return resources;
}
/**
 * Registers a GPU resource with its render context, so
 * `rebuildGpuResources` rebuilds it after a lost context is restored.
 * @param renderContext - The render context the resource belongs to.
 * @param kind - What kind of resource it is, which decides when it's rebuilt.
 * @param rebuild - Recreates the resource's WebGL objects.
 */
export function registerGpuResource(renderContext, kind, rebuild) {
    getGpuResources(renderContext)[kind].add(rebuild);
}
/**
 * Stops `rebuildGpuResources` rebuilding a resource, once it's disposed.
 * Does nothing for a resource that isn't registered.
 * @param renderContext - The render context the resource belongs to.
 * @param kind - The kind it was registered as.
 * @param rebuild - The callback it registered with.
 */
export function unregisterGpuResource(renderContext, kind, rebuild) {
    gpuResourcesByContext.get(renderContext)?.[kind].delete(rebuild);
}
/**
 * Rebuilds every GPU resource registered with `renderContext`, kind by kind
 * in the order of `GpuResourceKind`. One resource failing to rebuild doesn't
 * stop the others: every rebuild runs, and the errors are returned.
 * @param renderContext - The render context whose WebGL context was just
 * restored.
 * @returns The errors thrown by rebuilds that failed, if any.
 */
export function rebuildGpuResources(renderContext) {
    const resources = gpuResourcesByContext.get(renderContext);
    const errors = [];
    if (!resources) {
        return errors;
    }
    for (const kind of rebuildOrder) {
        for (const rebuild of resources[kind]) {
            try {
                rebuild();
            }
            catch (error) {
                errors.push(error);
            }
        }
    }
    return errors;
}
