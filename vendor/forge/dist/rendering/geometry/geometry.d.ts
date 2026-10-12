import type { Material } from '../materials/material.js';
import type { RenderContext } from '../render-context.js';
/**
 * One vertex attribute of a {@link Geometry}: a name the vertex shader
 * declares (`in vec2 a_position;`) and the float data it reads, `size`
 * components per vertex.
 */
export interface GeometryAttribute {
    /** The attribute's name in the vertex shader. */
    name: string;
    /** The attribute's data, `size` floats per vertex. */
    data: Float32Array;
    /** The number of components per vertex (`1` to `4`). */
    size: number;
}
/**
 * Vertex data on the GPU: one buffer per attribute, drawn with a material
 * whose vertex shader reads those attributes. The geometry keeps its vertex
 * data, so the render context can upload it again if the WebGL context is
 * lost and restored.
 *
 * Whoever creates a geometry owns it, and calls {@link Geometry.dispose}
 * once nothing draws it any more. `renderContext.quadGeometry` belongs to
 * the render context.
 */
export declare class Geometry {
    private readonly _renderContext;
    private readonly _attributes;
    private readonly _vaoCache;
    private readonly _rebuild;
    /**
     * Creates a geometry from vertex data, uploading each attribute to a
     * buffer of its own (or, while the WebGL context is lost, when it's
     * restored).
     * @param renderContext - The render context to create the geometry in.
     * @param attributes - The vertex attributes.
     */
    constructor(renderContext: RenderContext, attributes: readonly GeometryAttribute[]);
    /**
     * Binds the geometry's vertex array for `material`'s program, creating it
     * the first time the geometry is drawn with that program.
     * @param material - The material the geometry is about to be drawn with.
     * @throws An error if `material`'s program isn't linked yet (see
     * `Material.program`).
     */
    bind(material: Material): void;
    /**
     * Frees the geometry's buffers and vertex arrays, and stops the render
     * context rebuilding it.
     */
    dispose(): void;
    private _createBuffers;
    private _createVertexArrayObject;
}
