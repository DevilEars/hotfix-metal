import { Vec2 } from '../../math/index.js';
/**
 * Calculates the signed area of a polygon (positive for counter-clockwise
 * winding, negative for clockwise), via the shoelace formula.
 * @param vertices - The polygon's vertices, in order.
 */
export function calculateSignedArea(vertices) {
    let signedArea = 0;
    for (let i = 0; i < vertices.length; i++) {
        const current = vertices[i];
        const next = vertices[(i + 1) % vertices.length];
        signedArea += Vec2.cross(current, next);
    }
    return signedArea;
}
/**
 * Calculates the centroid (center of mass, assuming uniform density) of a
 * polygon.
 * @param vertices - The polygon's vertices, in order.
 */
export function calculateCentroid(vertices) {
    let centroidX = 0;
    let centroidY = 0;
    let signedArea = 0;
    for (let i = 0; i < vertices.length; i++) {
        const current = vertices[i];
        const next = vertices[(i + 1) % vertices.length];
        const cross = Vec2.cross(current, next);
        signedArea += cross;
        centroidX += (current.x + next.x) * cross;
        centroidY += (current.y + next.y) * cross;
    }
    const factor = 1 / (3 * signedArea);
    return { x: centroidX * factor, y: centroidY * factor };
}
/**
 * Calculates the outward-facing edge normal for each edge of a polygon.
 * @param vertices - The polygon's vertices, in order.
 */
export function calculateNormals(vertices) {
    const normals = [];
    for (let i = 0; i < vertices.length; i++) {
        const current = vertices[i];
        const next = vertices[(i + 1) % vertices.length];
        // Clone before subtracting: `current`/`next` are the caller's actual
        // vertex objects (often the same references stored on a collider), so
        // this must not mutate them.
        const edge = Vec2.subtract(Vec2.clone(next), current);
        normals.push(Vec2.normalize(Vec2.perpendicular(edge)));
    }
    return normals;
}
/**
 * Calculates the moment of inertia of a polygon about its own centroid, for
 * a given mass.
 * @param mass - The mass of the polygon.
 * @param verticesAboutCentroid - The polygon's vertices, in order, already
 * expressed relative to their own centroid.
 */
export function calculatePolygonMomentOfInertia(mass, verticesAboutCentroid) {
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < verticesAboutCentroid.length; i++) {
        const current = verticesAboutCentroid[i];
        const next = verticesAboutCentroid[(i + 1) % verticesAboutCentroid.length];
        const cross = Math.abs(Vec2.cross(current, next));
        numerator +=
            cross *
                (Vec2.dot(current, current) +
                    Vec2.dot(current, next) +
                    Vec2.dot(next, next));
        denominator += cross;
    }
    return (mass / 3) * (numerator / denominator);
}
/**
 * Calculates the area of a polygon.
 * @param vertices - The polygon's vertices, in order.
 */
export function calculateArea(vertices) {
    return Math.abs(calculateSignedArea(vertices)) / 2;
}
