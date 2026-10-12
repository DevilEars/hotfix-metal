import { Vector2 } from '../../math/index.js';
import { Aabb } from '../types/aabb.js';
import { Collider } from './collider.js';
/**
 * A single span of ground between two consecutive {@link TerrainCollider}
 * surface points: one link of the terrain's continuous surface chain, with
 * no closing side or bottom faces of its own. All fields are in the
 * terrain's local space.
 *
 * Narrow-phase collision treats the terrain as this chain of surface edges
 * rather than as a row of closed quadrilaterals, so a body wide enough to
 * span several edges only ever meets the ground's actual surface - there is
 * no interior face between two neighboring edges for it to catch on. An
 * edge's neighbors (the edges immediately before and after it in
 * {@link TerrainCollider.surface}) act as its "ghost" geometry, exactly as
 * a Box2D chain shape's neighboring segments do: they decide which of two
 * edges sharing a vertex owns a contact clamped to it, so the same physical
 * contact is never reported twice with two different normals.
 */
export interface TerrainSurfaceEdge {
    /**
     * The edge's left-hand endpoint, in local space. Always the lesser of the
     * edge's two x-coordinates, since a terrain's points are ordered by
     * strictly increasing x.
     *
     * This aliases the owning collider's own {@link TerrainCollider.points}
     * entry rather than copying it, so it must never be mutated.
     */
    start: Vector2;
    /**
     * The edge's right-hand endpoint, in local space. Always the greater of
     * the edge's two x-coordinates.
     *
     * This aliases the owning collider's own {@link TerrainCollider.points}
     * entry rather than copying it, so it must never be mutated.
     */
    end: Vector2;
    /**
     * The edge's unit-length outward normal, in local space: perpendicular to
     * `start`-`end` and pointing away from the solid slab. Since the slab
     * always extends below the surface, toward the collider's local -y, this
     * always points broadly toward local +y.
     */
    normal: Vector2;
}
/**
 * The world-space faces of the solid slab column directly beneath a single
 * {@link TerrainSurfaceEdge}, as consumed by volume queries that genuinely
 * care about the terrain's inside (currently only `raycastTerrain`).
 */
export interface TerrainEdgeSlab {
    /**
     * The column's four vertices, counter-clockwise like a
     * `PolygonCollider`'s: the edge's two surface points, right to left,
     * followed by their corresponding points on the terrain's flat bottom
     * edge.
     */
    vertices: Vector2[];
    /**
     * The column's four outward-facing edge normals, corresponding to the
     * edges between consecutive `vertices`.
     */
    normals: Vector2[];
}
/**
 * A static, non-convex 2D ground collider defined by a heightmap: a chain of
 * surface points, ordered left to right, closed off into a solid slab by a
 * flat bottom edge `depth` units below (toward local -y) the lowest surface
 * point. Author the points as the ground's surface in world coordinates,
 * with the entity unrotated, and the ground is below them.
 *
 * Like every collider, `points` are used exactly as authored, in the
 * entity's local space, with the owning entity's position acting as a
 * simple translation (typically `Vec2.zero`, with the terrain authored
 * directly in world coordinates).
 *
 * Narrow-phase collision against a `TerrainCollider` (see
 * `detectCircleTerrainCollision`/`detectPolygonTerrainCollision`) runs
 * against the {@link surface} chain, never against the slab: the slab only
 * exists to give the shape a well-defined area, silhouette and bounding box
 * (and to give `raycastTerrain` something solid to hit). Contact normals
 * therefore always come from the ground's actual surface, and a body
 * straddling several surface edges gets one contact per edge it genuinely
 * touches instead of a single contact that jumps between them.
 *
 * `TerrainCollider` is intended for static bodies only - attach it with
 * `addColliderComponent` and no `RigidBodyEcsComponent`. A heightmap has no
 * natural mass distribution to simulate as a moving object.
 */
export declare class TerrainCollider extends Collider {
    readonly type = "terrain";
    readonly points: readonly Vector2[];
    readonly depth: number;
    /**
     * The flat bottom edge's y-coordinate, in local space: `depth` units below
     * the lowest of `points` (`min(points.y) - depth`).
     */
    readonly bottomY: number;
    /**
     * The continuous chain of surface edges narrow-phase collision detection
     * tests against, one per consecutive pair of `points`, ordered left to
     * right.
     */
    readonly surface: readonly TerrainSurfaceEdge[];
    /**
     * Creates a new TerrainCollider instance.
     * @param points - The local-space surface points of the terrain, ordered
     * by strictly increasing x. Must contain at least 2 points.
     * @param depth - The thickness of the terrain slab below its lowest
     * point. Must be positive.
     * @throws An error if fewer than 2 points are provided, the points are
     * not ordered by strictly increasing x, or `depth` is not positive.
     */
    constructor(points: readonly Vector2[], depth: number);
    computeAabb(position: Vector2, rotation: number): Aabb;
}
/**
 * Builds the closed, convex quadrilateral column of solid terrain directly
 * beneath a single surface edge, transformed into world space, for volume
 * queries that need the terrain's inside rather than just its surface.
 *
 * Narrow-phase collision deliberately does *not* use this: a moving body
 * must only ever meet the terrain's surface, never the interior faces two
 * neighboring columns share (see {@link TerrainSurfaceEdge}). A ray, by
 * contrast, can legitimately enter the slab from any direction, so
 * `raycastTerrain` does.
 * @param edge - The surface edge whose column to build.
 * @param bottomY - The terrain's {@link TerrainCollider.bottomY}.
 * @param position - The terrain body's world position.
 * @param rotation - The terrain body's world rotation, in radians.
 * @returns The column's world-space vertices and outward-facing normals,
 * freshly allocated so the caller may transform them further in place.
 */
export declare function buildTerrainEdgeSlab(edge: TerrainSurfaceEdge, bottomY: number, position: Vector2, rotation: number): TerrainEdgeSlab;
