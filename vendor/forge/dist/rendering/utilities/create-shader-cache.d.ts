import { ShaderCache } from '../shaders/index.js';
/**
 * Creates and initializes a ShaderCache instance with predefined shader includes and shaders.
 *
 * The shader includes added to the ShaderCache provide reusable shader code snippets, such as
 * cubic interpolation, Perlin noise, quintic interpolation, radial gradients, random gradients,
 * signed distance functions (SDF) for circles, and oriented boxes, and the
 * `spriteMask` include every sprite fragment shader applies masks with.
 *
 * The shaders added to the ShaderCache include fragment and vertex shaders for rendering
 * radial gradients, Perlin noise, and sprites.
 *
 * @returns {ShaderCache} A ShaderCache instance populated with the predefined shader includes
 * and shaders.
 */
export declare function createShaderCache(): ShaderCache;
