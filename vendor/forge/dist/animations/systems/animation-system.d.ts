import { Time } from '../../common/index.js';
import { type AnimationEcsComponent } from '../components/index.js';
import { EcsSystem } from '../../ecs/index.js';
/**
 * Creates a new ECS-style animation system. Each update, it advances every
 * animated property on every {@link AnimationEcsComponent} by
 * `time.deltaTimeInMilliseconds`, calls its `updateCallback` with the eased
 * value, and restarts or removes it when it completes.
 * @param time - The Time instance.
 * @returns An ECS system that updates animations.
 */
export declare const createAnimationEcsSystem: (time: Time) => EcsSystem<[AnimationEcsComponent]>;
