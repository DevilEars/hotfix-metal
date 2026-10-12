import { EcsSystem } from '../../ecs/index.js';
/**
 * The part of a `GameState` its transition system writes. Kept out of
 * the public interface so the transition system is the only writer of
 * `current`, `entered` and `exited`.
 */
export interface GameStateStore<TName extends string> {
    current: TName;
    entered: TName | null;
    exited: TName | null;
    /** The last state requested with `set` since the previous transition. */
    next: TName | null;
}
/**
 * Creates the system that applies a game state's requested transition. It
 * runs in the world's `firstSystemGroup`, so a transition happens before
 * any other system of the tick, and it's the only writer of the state's
 * `current`, `entered` and `exited`. `createGameState` registers it.
 * @param store - The state's writable fields.
 * @returns The ECS system.
 */
export declare function createStateTransitionEcsSystem<TName extends string>(store: GameStateStore<TName>): EcsSystem<[]>;
