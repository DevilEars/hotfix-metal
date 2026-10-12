import { EcsSystem } from '../../ecs/ecs-system.js';
import { InputsEcsComponent } from '../components/inputs-component.js';
/**
 * Creates an ECS system to handle resetting inputs.
 */
export declare const createResetInputsEcsSystem: () => EcsSystem<[InputsEcsComponent]>;
