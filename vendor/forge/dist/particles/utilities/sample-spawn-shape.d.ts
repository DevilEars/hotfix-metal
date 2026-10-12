import { Random } from '../../math/random.js';
import { Vector2 } from '../../math/vector2.js';
import { ParticleSpawnShape } from '../components/particle-emitter.js';
/**
 * Picks a random point inside `shape`, relative to the shape's center.
 * @param shape - The shape to pick a point in.
 * @param random - The random instance used to pick the point.
 * @returns The picked point, as an offset from the shape's center.
 */
export declare function sampleSpawnShape(shape: ParticleSpawnShape, random: Random): Vector2;
