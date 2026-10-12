import { type Vector2 } from '../../math/index.js';
/**
 * The world-space vertices and outward-facing edge normals of a convex
 * polygon, as consumed by {@link detectPolygonFacesCollision}.
 *
 * `detectPolygonFacesCollision` never mutates `vertices`/`normals` (or their
 * elements) - callers may safely reuse the same `PolygonFaces` object across
 * multiple calls (e.g. against several of a terrain's surface edges).
 */
export interface PolygonFaces {
    vertices: Vector2[];
    normals: Vector2[];
}
/**
 * The result of a successful {@link detectPolygonFacesCollision} check,
 * everything a collision manifold needs besides the two entities involved.
 */
export interface PolygonFacesContact {
    /**
     * The contact normal, in world space, pointing from `facesA` toward
     * `facesB`.
     */
    normal: Vector2;
    /**
     * The penetration depth of the contact.
     */
    depth: number;
    /**
     * The world-space contact points (one or two points).
     */
    contactPoints: Vector2[];
    /**
     * Identifiers for each entry in `contactPoints` (same length, same order),
     * stable across ticks for the same reference/incident edge pairing, and
     * always within `[0, 2^21)`. See {@link CollisionManifold.featureIds}.
     */
    featureIds: number[];
}
/**
 * Resolves the contact between two convex polygons whose reference face has
 * already been chosen, by clipping the incident polygon's most anti-parallel
 * face against it.
 *
 * {@link detectPolygonFacesCollision} picks the reference face by separating
 * axis and calls straight through to this. A caller that already knows which
 * face the contact must resolve against - because the shape it is colliding
 * with only has one face it is allowed to push along, as a terrain's surface
 * edge does (see `detectPolygonTerrainCollision`) - can call this directly
 * instead, and still get a manifold interchangeable with that function's.
 *
 * Never mutates `reference`/`incident` (or their `vertices`/`normals`
 * elements).
 * @param reference - The polygon whose face the contact resolves against.
 * @param referenceFaceIndex - The index of that face within `reference`.
 * @param incident - The other polygon, whose face is clipped against it.
 * @param flip - Whether `reference` is the *second* of the two polygons the
 * caller wants the resulting normal oriented between, i.e. whether the
 * reference normal must be negated to point from the first toward the
 * second.
 * @returns A {@link PolygonFacesContact}, or `null` if nothing of the
 * incident face survives the clip.
 */
export declare function clipAgainstReferenceFace(reference: PolygonFaces, referenceFaceIndex: number, incident: PolygonFaces, flip: boolean): PolygonFacesContact | null;
/**
 * Detects a collision between two convex polygons, given as world-space
 * {@link PolygonFaces}, using the separating axis theorem with
 * reference/incident face clipping. Never mutates `facesA`/`facesB` (or
 * their `vertices`/`normals` elements), so callers may safely reuse the
 * same `PolygonFaces` across multiple calls.
 *
 * A caller may deliberately pass a degenerate shape: two vertices sharing
 * one repeated normal describe a zero-thickness, one-sided surface edge,
 * since the separating-axis search can then only ever pick an axis on that
 * one side of it (see `detectPolygonTerrainCollision`).
 * @param facesA - The first polygon's world-space vertices and normals.
 * @param facesB - The second polygon's world-space vertices and normals.
 * @returns A {@link PolygonFacesContact} if the polygons overlap, otherwise
 * `null`.
 */
export declare function detectPolygonFacesCollision(facesA: PolygonFaces, facesB: PolygonFaces): PolygonFacesContact | null;
