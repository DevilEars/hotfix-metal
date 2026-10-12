import { Vec2 } from '../../math/index.js';
import { Collider } from './collider.js';
import { calculateArea, calculateCentroid, calculatePolygonMomentOfInertia, } from './polygon-math.js';
const EPSILON = 1e-9;
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
export class TerrainCollider extends Collider {
    type = 'terrain';
    points;
    depth;
    /**
     * The flat bottom edge's y-coordinate, in local space: `depth` units below
     * the lowest of `points` (`min(points.y) - depth`).
     */
    bottomY;
    /**
     * The continuous chain of surface edges narrow-phase collision detection
     * tests against, one per consecutive pair of `points`, ordered left to
     * right.
     */
    surface;
    /**
     * Creates a new TerrainCollider instance.
     * @param points - The local-space surface points of the terrain, ordered
     * by strictly increasing x. Must contain at least 2 points.
     * @param depth - The thickness of the terrain slab below its lowest
     * point. Must be positive.
     * @throws An error if fewer than 2 points are provided, the points are
     * not ordered by strictly increasing x, or `depth` is not positive.
     */
    constructor(points, depth) {
        if (points.length < 2) {
            throw new Error(`TerrainCollider requires at least 2 points, received ${points.length}.`);
        }
        for (let i = 0; i < points.length - 1; i++) {
            if (points[i + 1].x <= points[i].x + EPSILON) {
                throw new Error('TerrainCollider points must be ordered by strictly increasing x.');
            }
        }
        if (depth <= 0) {
            throw new Error(`TerrainCollider depth must be positive, received "${depth}".`);
        }
        const clonedPoints = points.map((point) => Vec2.clone(point));
        const bottomY = Math.min(...clonedPoints.map((point) => point.y)) - depth;
        const silhouette = silhouetteVertices(clonedPoints, bottomY);
        const centroid = calculateCentroid(silhouette);
        // Clone before subtracting: `silhouette`'s surface vertices are the same
        // objects as `clonedPoints`, which becomes `this.points` below, so this
        // must not mutate them.
        const verticesAboutCentroid = silhouette.map((vertex) => Vec2.subtract(Vec2.clone(vertex), centroid));
        const mass = calculateArea(silhouette);
        const momentOfInertia = calculatePolygonMomentOfInertia(mass, verticesAboutCentroid);
        super(mass, momentOfInertia, centroid);
        this.points = clonedPoints;
        this.depth = depth;
        this.bottomY = bottomY;
        this.surface = buildSurface(clonedPoints);
    }
    computeAabb(position, rotation) {
        // Clone before transforming: `silhouetteVertices` reuses `this.points`'
        // own vector objects for the surface vertices, so this must not mutate
        // the collider's own stored points.
        const worldVertices = silhouetteVertices(this.points, this.bottomY).map((vertex) => Vec2.add(Vec2.rotate(Vec2.clone(vertex), rotation), position));
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const vertex of worldVertices) {
            minX = Math.min(minX, vertex.x);
            minY = Math.min(minY, vertex.y);
            maxX = Math.max(maxX, vertex.x);
            maxY = Math.max(maxY, vertex.y);
        }
        return {
            min: { x: minX, y: minY },
            max: { x: maxX, y: maxY },
        };
    }
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
export function buildTerrainEdgeSlab(edge, bottomY, position, rotation) {
    const localVertices = [
        edge.end,
        edge.start,
        { x: edge.start.x, y: bottomY },
        { x: edge.end.x, y: bottomY },
    ];
    // The three faces closing the column off below the surface are always
    // axis-aligned in local space - the two sides run straight down to the
    // flat bottom edge - so they never need deriving from the vertices.
    const localNormals = [
        edge.normal,
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
    ];
    return {
        // Clone before transforming: `edge.start`/`edge.end`/`edge.normal` are
        // the collider's own persistent local-space data, reused every tick.
        vertices: localVertices.map((vertex) => Vec2.add(Vec2.rotate(Vec2.clone(vertex), rotation), position)),
        normals: localNormals.map((normal) => Vec2.rotate(Vec2.clone(normal), rotation)),
    };
}
function silhouetteVertices(points, bottomY) {
    const first = points[0];
    const last = points[points.length - 1];
    // Counter-clockwise: along the bottom left to right, then back along the
    // surface right to left.
    return [
        { x: first.x, y: bottomY },
        { x: last.x, y: bottomY },
        ...[...points].reverse(),
    ];
}
function buildSurface(points) {
    const surface = [];
    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        // Clone before subtracting: `start`/`end` are the collider's own stored
        // points, which this must not mutate. Rotating the edge +90 degrees
        // gives a normal pointing toward local +y (the points are ordered by
        // increasing x), which is the side the solid slab is *not* on.
        const normal = Vec2.normalize(Vec2.negate(Vec2.perpendicular(Vec2.subtract(Vec2.clone(end), start))));
        surface.push({ start, end, normal });
    }
    return surface;
}
