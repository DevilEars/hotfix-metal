import { positionId, rotationId, } from '../../common/index.js';
import { getColliderRotation } from '../collider-rotation.js';
import { aabbsOverlap } from '../collision/aabb-overlap.js';
import { allCollisionCategories, colliderId, } from '../components/collider-component.js';
import { raycastCircle } from './raycast-circle.js';
import { raycastPolygon } from './raycast-polygon.js';
import { raycastTerrain } from './raycast-terrain.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const raycastDetectors = new Map([
    ['circle', raycastCircle],
    ['polygon', raycastPolygon],
    ['terrain', raycastTerrain],
]);
function raycastBody(body, start, end) {
    const detector = raycastDetectors.get(body.collider.type);
    if (!detector) {
        throw new Error(`No raycast detector registered for collider type "${body.collider.type}".`);
    }
    return detector(body, start, end);
}
function computeSegmentAabb(start, end) {
    return {
        min: { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y) },
        max: { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y) },
    };
}
const defaultRaycastOptions = {
    sort: true,
    mask: allCollisionCategories,
    includeSensors: false,
};
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
export function raycast(world, start, end, options = {}) {
    const { sort, mask, includeSensors } = withDefaults(defaultRaycastOptions, options);
    const { entities, components } = world.query([positionId, colliderId]);
    const [positions, colliders] = components;
    // Rotation is optional for colliders (an entity without one is treated as
    // unrotated), so it's read per entity rather than required by the query.
    const getRotation = world.getComponentAccessor(rotationId);
    const rayAabb = computeSegmentAabb(start, end);
    const hits = [];
    for (let i = 0; i < entities.length; i++) {
        const collider = colliders[i];
        if ((collider.category & mask) === 0 ||
            (collider.sensor && !includeSensors) ||
            !aabbsOverlap(rayAabb, collider.aabb)) {
            continue;
        }
        const body = {
            position: positions[i].world,
            rotation: getColliderRotation(getRotation(entities[i])),
            collider: collider.collider,
        };
        const hit = raycastBody(body, start, end);
        if (hit !== null) {
            hits.push({ entity: entities[i], ...hit });
        }
    }
    if (sort) {
        hits.sort((a, b) => a.distance - b.distance);
    }
    return hits;
}
