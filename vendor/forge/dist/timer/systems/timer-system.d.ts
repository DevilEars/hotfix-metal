import { Time } from '../../common/index.js';
import { TimerEcsComponent } from '../components/timer-component.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
/**
 * Creates an ECS system to handle timers. Each update, it adds
 * `time.deltaTimeInMilliseconds` to the `elapsed` of every task on every
 * {@link TimerEcsComponent}, runs each task whose `elapsed` has reached its
 * `delay`, and then either removes it or, for a repeating task, sets it up
 * for its next run.
 * @param time - The time instance used to advance each timer's elapsed time.
 * @returns The timer ECS system.
 */
export declare const createTimerEcsSystem: (time: Time) => EcsSystem<[TimerEcsComponent]>;
