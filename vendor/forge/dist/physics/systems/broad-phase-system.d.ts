import { PositionEcsComponent } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { ColliderEcsComponent } from '../components/collider-component.js';
import { CollisionPair } from '../types/collision-pair.js';
/**
 * Creates an ECS system that recomputes each collider's
 * {@link ColliderEcsComponent.aabb} from its entity's world
 * position/rotation and performs a broad-phase, all-pairs AABB overlap
 * test, writing every overlapping pair into `collisionPairs`. Pairs whose
 * categories and masks exclude each other (see `collidersCanCollide`) are
 * skipped before the AABB test. A collider entity needs a
 * `PositionEcsComponent` and a `ColliderEcsComponent` to take part;
 * `RotationEcsComponent` is optional, and an entity without one is treated
 * as unrotated. Must run after whatever system computes
 * `PositionEcsComponent.world`/`RotationEcsComponent.world` (e.g.
 * `createTransformEcsSystem`), since local values are only meaningful to
 * the parenting system.
 * @param collisionPairs - The array the system clears and refills with the
 * current tick's overlapping entity pairs.
 * @returns An ECS system that populates `collisionPairs` every tick.
 */
export declare const createBroadPhaseEcsSystem: (collisionPairs: CollisionPair[]) => EcsSystem<[PositionEcsComponent, ColliderEcsComponent]>;
