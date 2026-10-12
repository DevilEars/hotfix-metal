import { Time } from '../common/index.js';
import { EcsWorld } from '../ecs/index.js';
import { Axis1dAction, Axis2dAction, HoldAction, TriggerAction } from './actions/index.js';
import { InputManager } from './input-manager.js';
/**
 * Creates an InputManager, registers it on a new entity in the world, and
 * adds the update and reset systems that drive it each frame.
 * @param world - The world to register the input entity and systems with.
 * @param time - The Time instance used to advance the InputManager each frame.
 * @param options - Actions to register with the InputManager up front.
 * @param options.triggerActions - Trigger actions to add to the InputManager.
 * @param options.axis1dActions - 1D axis actions to add to the InputManager.
 * @param options.axis2dActions - 2D axis actions to add to the InputManager.
 * @param options.holdActions - Hold actions to add to the InputManager.
 * @returns The InputManager, for creating input sources and bindings against.
 */
export declare const registerInputs: (world: EcsWorld, time: Time, options?: {
    triggerActions?: TriggerAction[];
    axis1dActions?: Axis1dAction[];
    axis2dActions?: Axis2dAction[];
    holdActions?: HoldAction[];
}) => InputManager;
