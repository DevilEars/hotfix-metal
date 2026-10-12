import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { LifetimeEcsComponent } from '../components/lifetime-component.js';
/**
 * Creates an ECS system that adds `time.deltaTimeInSeconds` to every
 * {@link LifetimeEcsComponent}'s `elapsedSeconds` each tick, and sets its
 * `hasExpired` to `true` once `elapsedSeconds` reaches `durationSeconds`.
 * It doesn't remove entities; register a disposal system, such as
 * `createRemoveFromWorldEcsSystem`, after it.
 * @param time - The game's time, read for each tick's delta time.
 * @returns The ECS system.
 */
export declare const createLifetimeTrackingEcsSystem: (time: Time) => EcsSystem<[LifetimeEcsComponent]>;
