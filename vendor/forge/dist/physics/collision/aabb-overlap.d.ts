import { Aabb } from '../types/aabb.js';
/**
 * Checks whether two axis-aligned bounding boxes overlap (including edges
 * touching).
 * @param a - The first AABB.
 * @param b - The second AABB.
 * @returns `true` if the AABBs overlap, otherwise `false`.
 */
export declare function aabbsOverlap(a: Aabb, b: Aabb): boolean;
