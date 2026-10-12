/**
 * Creates a run condition that is true while `state` is in one of `names`.
 * Pass it as `runIf` to run a system or system group only in those states.
 * @param state - The game state to read.
 * @param names - The states in which the condition is true.
 * @returns The run condition.
 */
export function inState(state, ...names) {
    return () => names.includes(state.current);
}
/**
 * Creates a run condition that is true on the tick `state` enters one of
 * `names`. Register systems with it in the state's `enterGroup`, so they
 * run at the transition, before any other system of the tick.
 * @param state - The game state to read.
 * @param names - The states whose entry makes the condition true.
 * @returns The run condition.
 */
export function onEnter(state, ...names) {
    return () => state.entered !== null && names.includes(state.entered);
}
/**
 * Creates a run condition that is true on the tick `state` leaves one of
 * `names`. Register systems with it in the state's `exitGroup`, so they
 * run at the transition, before the state's scoped entities are removed.
 * @param state - The game state to read.
 * @param names - The states whose exit makes the condition true.
 * @returns The run condition.
 */
export function onExit(state, ...names) {
    return () => state.exited !== null && names.includes(state.exited);
}
