import { EcsSystem } from '../../ecs/ecs-system.js';
import { PositionEcsComponent } from '../components/index.js';
/**
 * Creates a system that computes the world position, rotation and scale of
 * every entity from its local transform and, if it has a `ParentEcsComponent`,
 * its parent's world transform.
 *
 * Entities (and their entire parent chain) with `PositionEcsComponent.isStatic`
 * set to `true` have their world transform computed once and then skipped on
 * every subsequent frame.
 * @returns The transform ECS system.
 */
export declare const createTransformEcsSystem: () => EcsSystem<[PositionEcsComponent]>;
