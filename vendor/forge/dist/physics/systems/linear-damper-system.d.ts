import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { LinearDamperEcsComponent } from '../components/linear-damper-component.js';
/**
 * Creates an ECS system that applies every `LinearDamperEcsComponent`'s
 * force, opposing the closing velocity between its two anchor points along
 * the line connecting them, converted to an impulse for the tick
 * (`force * deltaTime`). A pure force generator - like gravity, it has no
 * warm-start state and should run before whatever system resolves hard
 * constraints (`createCollisionResolutionEcsSystem`, joint systems) so they
 * see this tick's damping force reflected in velocity.
 * @param time - Used to read the tick's delta time.
 * @returns An ECS system that applies every damper's force every tick.
 */
export declare const createLinearDamperEcsSystem: (time: Time) => EcsSystem<[LinearDamperEcsComponent]>;
