import type { RenderContext } from './render-context.js';
/**
 * Recreates one GPU resource's WebGL objects from what it keeps on the CPU
 * side, after the render context's WebGL context has been restored.
 */
type RebuildGpuResource = () => void;
/**
 * The kinds of GPU resource a render context rebuilds, in the order it
 * rebuilds them: textures first, then the render targets whose framebuffers
 * attach those textures, then geometry. (Shader programs are linked again before
 * any of these, from the render context's own program cache.)
 */
export type GpuResourceKind = 'texture' | 'renderTarget' | 'geometry';
/**
 * Registers a GPU resource with its render context, so
 * `rebuildGpuResources` rebuilds it after a lost context is restored.
 * @param renderContext - The render context the resource belongs to.
 * @param kind - What kind of resource it is, which decides when it's rebuilt.
 * @param rebuild - Recreates the resource's WebGL objects.
 */
export declare function registerGpuResource(renderContext: RenderContext, kind: GpuResourceKind, rebuild: RebuildGpuResource): void;
/**
 * Stops `rebuildGpuResources` rebuilding a resource, once it's disposed.
 * Does nothing for a resource that isn't registered.
 * @param renderContext - The render context the resource belongs to.
 * @param kind - The kind it was registered as.
 * @param rebuild - The callback it registered with.
 */
export declare function unregisterGpuResource(renderContext: RenderContext, kind: GpuResourceKind, rebuild: RebuildGpuResource): void;
/**
 * Rebuilds every GPU resource registered with `renderContext`, kind by kind
 * in the order of `GpuResourceKind`. One resource failing to rebuild doesn't
 * stop the others: every rebuild runs, and the errors are returned.
 * @param renderContext - The render context whose WebGL context was just
 * restored.
 * @returns The errors thrown by rebuilds that failed, if any.
 */
export declare function rebuildGpuResources(renderContext: RenderContext): unknown[];
export {};
