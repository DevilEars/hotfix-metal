import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { InputsEcsComponent } from '../components/inputs-component.js';
/**
 * Creates an ECS system to handle updating inputs.
 */
export declare const createUpdateInputEcsSystem: (time: Time) => EcsSystem<[InputsEcsComponent]>;
