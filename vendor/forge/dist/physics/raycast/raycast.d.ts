import { EcsWorld } from '../../ecs/index.js';
import { Vector2 } from '../../math/index.js';
import { RaycastHit } from '../types/raycast-hit.js';
/**
 * Options for {@link raycast}.
 */
export interface RaycastOptions {
    /**
     * When `true`, results are ordered by distance from `start`, so the first
     * result is the nearest entity along the ray. Pass `false` to skip the
     * sort if you only need a yes/no check, or intend to find the closest hit
     * yourself. Defaults to `true`.
     */
    sort: boolean;
    /**
     * The collider categories the ray can hit: a collider is tested only if
     * its `category` shares a bit with this mask. Defaults to
     * {@link allCollisionCategories}.
     */
    mask: number;
    /**
     * When `true`, the ray also hits sensor colliders. Defaults to `false`,
     * so a ray aimed at walls passes through trigger zones.
     */
    includeSensors: boolean;
}
/**
 * Casts a line segment from `start` to `end` against every entity in
 * `world` with a {@link ColliderEcsComponent} and a `PositionEcsComponent`,
 * and returns one hit for each collider it crosses, at the intersection
 * closest to `start`. Use it for hitscan weapons, line-of-sight checks, and
 * ground or wall detection.
 *
 * Before testing an entity's exact collider shape, `raycast` skips any
 * collider whose {@link ColliderEcsComponent.aabb} doesn't overlap the
 * ray's own bounding box, so casting against a `world` with many entities
 * is cheap as long as most of them aren't near the ray. Those bounds are
 * written by `createBroadPhaseEcsSystem`, so a collider added since the
 * broad phase last ran can't be hit yet.
 * @param world - The ECS world to search for collider entities in.
 * @param start - The ray's world-space start point.
 * @param end - The ray's world-space end point.
 * @param options - Sorting and filtering; see {@link RaycastOptions}.
 * @returns A {@link RaycastHit} for each collider the ray crosses.
 */
export declare function raycast(world: EcsWorld, start: Vector2, end: Vector2, options?: Partial<RaycastOptions>): RaycastHit[];
