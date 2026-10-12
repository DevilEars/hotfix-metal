/**
 * Checks whether two axis-aligned bounding boxes overlap (including edges
 * touching).
 * @param a - The first AABB.
 * @param b - The second AABB.
 * @returns `true` if the AABBs overlap, otherwise `false`.
 */
export function aabbsOverlap(a, b) {
    return (a.min.x <= b.max.x &&
        a.max.x >= b.min.x &&
        a.min.y <= b.max.y &&
        a.max.y >= b.min.y);
}
