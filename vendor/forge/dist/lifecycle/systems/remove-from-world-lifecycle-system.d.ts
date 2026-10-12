import { LifetimeEcsComponent } from '../components/lifetime-component.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
/**
 * Creates an ECS system that removes every entity tagged with
 * `RemoveFromWorldLifetimeStrategyId` whose {@link LifetimeEcsComponent}
 * has expired. Register it after `createLifetimeTrackingEcsSystem`, so an
 * entity is removed on the tick it expires.
 * @returns The ECS system.
 */
export declare const createRemoveFromWorldEcsSystem: () => EcsSystem<[LifetimeEcsComponent]>;
