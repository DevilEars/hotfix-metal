/**
 * The shaders materials are created from, by the name each one gives
 * itself with `#pragma forge name(...)`. Each shader is run through the
 * cache's pre-processors (`createShaderCache` resolves
 * `#pragma forge include(...)` with them) before a material uses it.
 */
export class ShaderCache {
    _shaders;
    _processedShaders;
    _preProcessors;
    constructor(preProcessors) {
        this._shaders = new Map();
        this._processedShaders = new Map();
        this._preProcessors = preProcessors;
    }
    /**
     * Adds a shader, under its `name`. A shader with the same name as one
     * already in the cache isn't added, and the cache keeps the first.
     * @param shaderSource - The shader to add.
     * @param preProcess - Whether to run the cache's pre-processors on the
     * shader now (default: `true`). Otherwise they run when the shader is
     * first retrieved with `getShader`.
     * @returns The cache, for chaining.
     */
    addShader(shaderSource, preProcess = true) {
        if (this._shaders.has(shaderSource.name)) {
            return this;
        }
        if (preProcess) {
            shaderSource.applyPreProcessors(this._preProcessors);
            this._processedShaders.set(shaderSource.name, shaderSource);
        }
        this._shaders.set(shaderSource.name, shaderSource);
        return this;
    }
    /**
     * Retrieves and resolves a shader by name.
     * @param name - The name of the shader to retrieve.
     * @returns The resolved shader.
     * @throws An error if the cache has no shader called `name`.
     */
    getShader(name) {
        if (this._processedShaders.has(name)) {
            return this._processedShaders.get(name);
        }
        const shader = this._shaders.get(name);
        if (!shader) {
            throw new Error(`Shader with name ${name} not found.`);
        }
        shader.applyPreProcessors(this._preProcessors);
        this._processedShaders.set(name, shader);
        return shader;
    }
}
