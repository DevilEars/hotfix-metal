import { Matrix3x3 } from '../../math/index.js';
import { Texture } from '../texture.js';
/**
 * Distinguishes a `Vector2` uniform value from the rest of `UniformValue`'s
 * members. `Vector2` is a plain `{ x, y }` object rather than a class, so it
 * can't be told apart with `instanceof` the way `Matrix3x3` can.
 * @param value - The uniform value to check.
 * @returns Whether the value is a `Vector2`.
 */
export function isVector2(value) {
    return (typeof value === 'object' &&
        !(value instanceof Matrix3x3) &&
        !(value instanceof Texture) &&
        'x' in value &&
        'y' in value);
}
