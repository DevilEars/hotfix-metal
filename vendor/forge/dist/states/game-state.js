import { createSystemGroup } from '../ecs/index.js';
import { createStateScopedRemovalEcsSystem } from './systems/state-scoped-removal-system.js';
import { createStateTransitionEcsSystem, } from './systems/state-transition-system.js';
/**
 * Creates a {@link GameState} owned by `world`, starting in `initial`.
 *
 * Registers, in order at the start of every tick: a transition system in
 * the world's `firstSystemGroup`, which applies the last `set` of the
 * previous tick; the state's `exitGroup`; a system that removes the
 * entities whose `StateScopedEcsComponent` matches the transition; and the
 * state's `enterGroup`. Every other group of the world runs after them, so
 * every system in a tick reads the same `current`.
 *
 * On the first tick, `initial` counts as entered, so its `onEnter` systems
 * run.
 * @param world - The world that applies the state's transitions and runs
 * its exit and enter groups.
 * @param initial - The state to start in.
 * @returns The game state.
 */
export function createGameState(world, initial) {
    const store = {
        current: initial,
        entered: null,
        exited: null,
        next: null,
    };
    const exitGroup = createSystemGroup('state-exit');
    const removalGroup = createSystemGroup('state-scoped-removal');
    const enterGroup = createSystemGroup('state-enter');
    const state = {
        get current() {
            return store.current;
        },
        get entered() {
            return store.entered;
        },
        get exited() {
            return store.exited;
        },
        exitGroup,
        enterGroup,
        set(next) {
            store.next = next;
        },
    };
    world.addSystem(createStateTransitionEcsSystem(store), {
        group: world.firstSystemGroup,
    });
    world.addSystemGroup(exitGroup, {
        after: [world.firstSystemGroup],
        runIf: () => store.exited !== null,
    });
    world.addSystemGroup(removalGroup, {
        after: [exitGroup],
        runIf: () => store.entered !== null,
    });
    world.addSystemGroup(enterGroup, {
        after: [removalGroup],
        runIf: () => store.entered !== null,
    });
    world.addSystem(createStateScopedRemovalEcsSystem(state), {
        group: removalGroup,
    });
    return state;
}
