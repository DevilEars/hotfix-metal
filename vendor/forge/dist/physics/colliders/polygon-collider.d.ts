import { Vector2 } from '../../math/index.js';
import { Aabb } from '../types/aabb.js';
import { Collider } from './collider.js';
/**
 * A convex polygon collider, defined by a set of vertices in the entity's
 * local space. The vertices are kept where they're authored (only their
 * winding order is normalized to counter-clockwise), so a shape drawn
 * around a sprite's pivot lines up with the sprite. The polygon's centroid
 * is its {@link localCenterOfMass}, which needn't be the entity's origin.
 */
export declare class PolygonCollider extends Collider {
    readonly type = "polygon";
    readonly vertices: readonly Vector2[];
    readonly normals: readonly Vector2[];
    /**
     * Creates a new PolygonCollider instance.
     * @param vertices - The vertices of the polygon, in order, in the
     * entity's local space.
     * Must describe a convex polygon with at least 3 vertices. Vertices may
     * be supplied in either winding order.
     * @param density - The density used to derive mass from the polygon's
     * area.
     * @throws An error if fewer than 3 vertices are provided, the vertices
     * are collinear/degenerate, or the vertices do not form a convex polygon.
     */
    constructor(vertices: readonly Vector2[], density?: number);
    /**
     * Transforms the collider's local-space vertices into world space.
     * @param position - The world-space position of the entity.
     * @param rotation - The world-space rotation of the entity, in radians.
     * @returns The world-space vertices of the polygon.
     */
    getWorldVertices(position: Vector2, rotation: number): Vector2[];
    /**
     * Transforms the collider's local-space face normals into world space.
     * @param rotation - The world-space rotation of the entity, in radians.
     * @returns The world-space face normals of the polygon.
     */
    getWorldNormals(rotation: number): Vector2[];
    computeAabb(position: Vector2, rotation: number): Aabb;
}
