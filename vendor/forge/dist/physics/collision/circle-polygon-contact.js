import { Vec2 } from '../../math/index.js';
const EPSILON = 1e-9;
/**
 * Finds the polygon face with the largest separation from `localCenter`
 * (a circle's center, in the polygon's own local space), for use as the
 * circle's reference face. Returns `null` if the circle's `radius` cannot
 * reach any face, meaning the shapes do not overlap.
 * @param vertices - The polygon's vertices, in its own local space.
 * @param normals - The polygon's outward-facing edge normals, matching
 * `vertices`.
 * @param localCenter - The circle's center, in the polygon's local space.
 * @param radius - The circle's radius.
 * @returns The closest face and its separation, or `null` if the shapes
 * cannot overlap.
 */
export function findClosestFace(vertices, normals, localCenter, radius) {
    let separation = -Infinity;
    let faceIndex = 0;
    for (let i = 0; i < vertices.length; i++) {
        // Clone before subtracting: `localCenter` is reused on every iteration,
        // and `vertices[i]` is the polygon's own stored local vertex.
        const faceSeparation = Vec2.dot(normals[i], Vec2.subtract(Vec2.clone(localCenter), vertices[i]));
        if (faceSeparation > radius) {
            return null;
        }
        if (faceSeparation > separation) {
            separation = faceSeparation;
            faceIndex = i;
        }
    }
    return { separation, faceIndex };
}
function faceContact(normal, localCenter, separation, radius) {
    // `normal` is the polygon's own stored local normal, and the caller
    // further rotates/negates the returned `localNormal` - both must be
    // independent clones, not the collider's stored vector.
    return {
        localNormal: Vec2.clone(normal),
        localContactPoint: Vec2.subtract(Vec2.clone(localCenter), Vec2.multiply(Vec2.clone(normal), separation)),
        depth: radius - separation,
    };
}
function vertexContact(localCenter, vertex, radius) {
    const distance = Vec2.distanceTo(localCenter, vertex);
    if (distance > radius) {
        return null;
    }
    // `vertex` is the polygon's own stored local vertex, and the caller
    // further rotates/translates the returned `localContactPoint` - it must
    // be an independent clone, not the collider's stored vector.
    return {
        localNormal: Vec2.normalize(Vec2.subtract(Vec2.clone(localCenter), vertex)),
        localContactPoint: Vec2.clone(vertex),
        depth: radius - distance,
    };
}
/**
 * Resolves the exact contact (face or vertex) between a circle and the
 * polygon face found by {@link findClosestFace}, in the polygon's own
 * local space.
 * @param vertices - The polygon's vertices, in its own local space.
 * @param normals - The polygon's outward-facing edge normals, matching
 * `vertices`.
 * @param localCenter - The circle's center, in the polygon's local space.
 * @param faceIndex - The closest face's index, from {@link findClosestFace}.
 * @param separation - The closest face's separation, from
 * {@link findClosestFace}.
 * @param radius - The circle's radius.
 * @returns The resolved contact, or `null` if the shapes do not actually
 * overlap (the circle's center lies beyond a vertex, out of `radius`).
 */
export function findCircleContact(vertices, normals, localCenter, faceIndex, separation, radius) {
    if (separation < EPSILON) {
        return faceContact(normals[faceIndex], localCenter, separation, radius);
    }
    const v1 = vertices[faceIndex];
    const v2 = vertices[(faceIndex + 1) % vertices.length];
    // Clone before subtracting throughout: `localCenter` is reused below, and
    // `v1`/`v2` are the polygon's own stored local vertices.
    const u1 = Vec2.dot(Vec2.subtract(Vec2.clone(localCenter), v1), Vec2.subtract(Vec2.clone(v2), v1));
    if (u1 <= 0) {
        return vertexContact(localCenter, v1, radius);
    }
    const u2 = Vec2.dot(Vec2.subtract(Vec2.clone(localCenter), v2), Vec2.subtract(Vec2.clone(v1), v2));
    if (u2 <= 0) {
        return vertexContact(localCenter, v2, radius);
    }
    return faceContact(normals[faceIndex], localCenter, separation, radius);
}
