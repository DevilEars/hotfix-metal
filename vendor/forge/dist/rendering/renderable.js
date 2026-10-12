/**
 * How the render system draws one kind of instanced quad: the material, the
 * per-instance data layout its vertex shader reads, and how a batch's
 * textures are bound. Internal to the render system, which creates one per
 * sprite material and one per text pass; not part of the public API.
 */
export class Renderable {
    /**
     * The material (shaders and uniforms) to draw with.
     */
    material;
    /**
     * The number of float values required per instance in the instance data buffer.
     * This determines how much data needs to be provided for each entity being rendered.
     */
    floatsPerInstance;
    /**
     * Callback function that binds instance-specific data for an entity into a buffer.
     * Called for each entity to prepare its data for instanced rendering.
     */
    bindInstanceData;
    /**
     * Callback function that sets up WebGL vertex attribute pointers for instanced rendering.
     * Called to configure how instance data should be interpreted by the shader.
     */
    setupInstanceAttributes;
    /**
     * Binds the material for a batch, with the batch's textures.
     */
    bindBatch;
    /**
     * Creates a new Renderable.
     *
     * @param material - The material to draw with
     * @param floatsPerInstance - The number of floats per instance in the instance buffer
     * @param bindInstanceData - Callback to bind instance data for each entity
     * @param setupInstanceAttributes - Callback to setup instance attributes in WebGL
     * @param bindBatch - Callback to bind the material for a batch
     */
    constructor(material, floatsPerInstance, bindInstanceData, setupInstanceAttributes, bindBatch) {
        this.material = material;
        this.floatsPerInstance = floatsPerInstance;
        this.bindInstanceData = bindInstanceData;
        this.setupInstanceAttributes = setupInstanceAttributes;
        this.bindBatch = bindBatch;
    }
}
