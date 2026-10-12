/**
 * Creates the system that applies a game state's requested transition. It
 * runs in the world's `firstSystemGroup`, so a transition happens before
 * any other system of the tick, and it's the only writer of the state's
 * `current`, `entered` and `exited`. `createGameState` registers it.
 * @param store - The state's writable fields.
 * @returns The ECS system.
 */
export function createStateTransitionEcsSystem(store) {
    let isFirstTick = true;
    return {
        name: 'state-transition',
        query: [],
        update: () => {
            store.entered = null;
            store.exited = null;
            if (isFirstTick) {
                isFirstTick = false;
                store.entered = store.current;
                return;
            }
            if (store.next === null) {
                return;
            }
            store.exited = store.current;
            store.entered = store.next;
            store.current = store.next;
            store.next = null;
        },
    };
}
