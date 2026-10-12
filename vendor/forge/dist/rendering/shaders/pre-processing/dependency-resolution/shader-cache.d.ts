import { ForgeShaderSource } from '../forge-shader-source.js';
import { ShaderPreProcessor } from '../shader-pre-processor.js';
/**
 * The shaders materials are created from, by the name each one gives
 * itself with `#pragma forge name(...)`. Each shader is run through the
 * cache's pre-processors (`createShaderCache` resolves
 * `#pragma forge include(...)` with them) before a material uses it.
 */
export declare class ShaderCache {
    private readonly _shaders;
    private readonly _processedShaders;
    private readonly _preProcessors;
    constructor(preProcessors: ShaderPreProcessor[]);
    /**
     * Adds a shader, under its `name`. A shader with the same name as one
     * already in the cache isn't added, and the cache keeps the first.
     * @param shaderSource - The shader to add.
     * @param preProcess - Whether to run the cache's pre-processors on the
     * shader now (default: `true`). Otherwise they run when the shader is
     * first retrieved with `getShader`.
     * @returns The cache, for chaining.
     */
    addShader(shaderSource: ForgeShaderSource, preProcess?: boolean): this;
    /**
     * Retrieves and resolves a shader by name.
     * @param name - The name of the shader to retrieve.
     * @returns The resolved shader.
     * @throws An error if the cache has no shader called `name`.
     */
    getShader(name: string): ForgeShaderSource;
}
