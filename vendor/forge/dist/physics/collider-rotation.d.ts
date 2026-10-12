import { RotationEcsComponent } from '../common/index.js';
/**
 * Resolves the world rotation collision detection should use for a collider
 * entity: its `RotationEcsComponent.world`, or `0` (unrotated) if `rotation`
 * is `null`. Rotation is optional for colliders - a static, axis-aligned
 * wall or trigger volume has no reason to carry one - so the broad phase,
 * narrow phase, and `raycast` all read it through this helper instead of
 * requiring the component, which would silently exclude such entities from
 * collision detection.
 * @param rotation - The entity's rotation component, or `null` if it has
 * none.
 * @returns The rotation, in radians, to use for the entity's collider.
 */
export declare function getColliderRotation(rotation: RotationEcsComponent | null): number;
