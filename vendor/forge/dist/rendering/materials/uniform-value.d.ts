import { Matrix3x3, Vector2 } from '../../math/index.js';
import { Texture } from '../texture.js';
/**
 * A value that can be assigned to a shader uniform with
 * {@link Material.setUniform}. Which values a given uniform accepts depends
 * on its declared GLSL type, see {@link Material.setUniform}.
 */
export type UniformValue = number | boolean | Float32Array | Int32Array | Uint32Array | Texture | Vector2 | Matrix3x3;
/**
 * Distinguishes a `Vector2` uniform value from the rest of `UniformValue`'s
 * members. `Vector2` is a plain `{ x, y }` object rather than a class, so it
 * can't be told apart with `instanceof` the way `Matrix3x3` can.
 * @param value - The uniform value to check.
 * @returns Whether the value is a `Vector2`.
 */
export declare function isVector2(value: UniformValue): value is Vector2;
