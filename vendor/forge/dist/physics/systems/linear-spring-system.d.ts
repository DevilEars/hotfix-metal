import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { LinearSpringEcsComponent } from '../components/linear-spring-component.js';
/**
 * Creates an ECS system that applies every `LinearSpringEcsComponent`'s
 * Hooke's-law force between its two anchor points, converted to an impulse
 * for the tick (`force * deltaTime`). A pure force generator - like gravity,
 * it has no warm-start state and should run before whatever system resolves
 * hard constraints (`createCollisionResolutionEcsSystem`, joint systems) so
 * they see this tick's spring force reflected in velocity.
 * @param time - Used to read the tick's delta time.
 * @returns An ECS system that applies every spring's force every tick.
 */
export declare const createLinearSpringEcsSystem: (time: Time) => EcsSystem<[LinearSpringEcsComponent]>;
