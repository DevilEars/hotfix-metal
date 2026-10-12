import { EcsSystem } from '../../ecs/index.js';
import { StateScopedEcsComponent } from '../components/state-scoped-component.js';
import { GameState } from '../game-state.js';
/**
 * Creates the system that removes the entities scoped to `state` when it
 * leaves one of their `removeOnExit` states or enters one of their
 * `removeOnEnter` states. `createGameState` registers it between the
 * state's `exitGroup` and `enterGroup`.
 * @param state - The game state whose scoped entities the system removes.
 * @returns The ECS system.
 */
export declare function createStateScopedRemovalEcsSystem<TName extends string>(state: GameState<TName>): EcsSystem<[StateScopedEcsComponent]>;
