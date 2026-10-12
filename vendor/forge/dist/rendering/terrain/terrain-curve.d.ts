import { Vector2 } from '../../math/index.js';
/**
 * A point on a curve built by {@link buildTerrainCurve}.
 */
export interface TerrainCurvePoint {
    /**
     * The point's local-space position.
     */
    position: Vector2;
    /**
     * The cumulative arc length from the start of the curve to this point.
     */
    distance: number;
}
/**
 * Builds a smooth curve through `controlPoints`, using a Catmull-Rom spline
 * (converted to an equivalent sequence of cubic Beziers, one per segment,
 * via the standard `Bn = Pn +/- (Pn+1 - Pn-1) / 6` tangent construction) so
 * the curve passes exactly through every control point with a continuous
 * tangent, rather than a straight-line polyline between them. Densely
 * sampling that curve turns a handful of sparse control points into a long,
 * natural-looking silhouette suitable for both a `TerrainCollider`'s collision
 * points and a matching render mesh (see `createTerrainMesh`) - the same
 * points can drive both, so what's drawn always matches what's touched.
 * @param controlPoints - The sparse anchor points the curve passes through,
 * ordered by strictly increasing x. Must contain at least 2 points.
 * @param samplesPerSegment - How many points to sample along each segment
 * between two consecutive control points.
 * @returns A dense polyline approximating the smooth curve, with each
 * point's cumulative arc length from the start.
 * @throws An error if fewer than 2 control points are provided.
 */
export declare function buildTerrainCurve(controlPoints: readonly Vector2[], samplesPerSegment: number): TerrainCurvePoint[];
/**
 * Finds a curve's surface height (local-space y) at a given local-space x,
 * linearly interpolating between the two bracketing sampled points.
 * `curvePoints` must be ordered by strictly increasing x (as returned by
 * {@link buildTerrainCurve}).
 * @param curvePoints - The dense curve to search. Must contain at least 1 point.
 * @param localX - The local-space x to find the height at.
 * @returns The interpolated local-space y at `localX`.
 * @throws An error if `curvePoints` is empty.
 */
export declare function heightAtLocalX(curvePoints: readonly TerrainCurvePoint[], localX: number): number;
