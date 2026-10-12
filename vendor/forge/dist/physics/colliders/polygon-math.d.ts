import { Vector2 } from '../../math/index.js';
/**
 * Calculates the signed area of a polygon (positive for counter-clockwise
 * winding, negative for clockwise), via the shoelace formula.
 * @param vertices - The polygon's vertices, in order.
 */
export declare function calculateSignedArea(vertices: readonly Vector2[]): number;
/**
 * Calculates the centroid (center of mass, assuming uniform density) of a
 * polygon.
 * @param vertices - The polygon's vertices, in order.
 */
export declare function calculateCentroid(vertices: readonly Vector2[]): Vector2;
/**
 * Calculates the outward-facing edge normal for each edge of a polygon.
 * @param vertices - The polygon's vertices, in order.
 */
export declare function calculateNormals(vertices: readonly Vector2[]): Vector2[];
/**
 * Calculates the moment of inertia of a polygon about its own centroid, for
 * a given mass.
 * @param mass - The mass of the polygon.
 * @param verticesAboutCentroid - The polygon's vertices, in order, already
 * expressed relative to their own centroid.
 */
export declare function calculatePolygonMomentOfInertia(mass: number, verticesAboutCentroid: readonly Vector2[]): number;
/**
 * Calculates the area of a polygon.
 * @param vertices - The polygon's vertices, in order.
 */
export declare function calculateArea(vertices: readonly Vector2[]): number;
