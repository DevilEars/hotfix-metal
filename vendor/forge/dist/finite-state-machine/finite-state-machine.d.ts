import { State } from './state.js';
import { Transition } from './transition.js';
/**
 * A generic finite state machine (FSM) implementation.
 * TInput represents the type of input used to trigger state transitions.
 * TState represents the type of states managed by the FSM.
 */
export declare class FiniteStateMachine<TInput, TState extends State> {
    private _currentState;
    private readonly _states;
    /**
     * Creates an instance of FiniteStateMachine.
     *
     * @param states - The states to include in the FSM.
     * @param startingState - The initial state of the FSM. If not provided, the first state in the states array will be used.
     * @throws Will throw an error if no states are provided or if the starting state is not in the provided states.
     */
    constructor(states: TState[], startingState?: TState);
    /**
     * Adds a transition to the finite state machine.
     * @param fromState - The state to transition from.
     * @param toState - The state to transition to.
     * @param transition - The transition to add.
     * @throws Will throw an error if either the fromState or toState does not exist in the FSM.
     */
    addTransition(fromState: TState, toState: TState, transition: Transition<TInput>): void;
    /**
     * Adds a new state to the finite state machine.
     * @param state - The state to add.
     * @throws Will throw an error if the state already exists in the FSM.
     */
    addState(state: TState): void;
    /**
     * Gets the current state of the finite state machine.
     * @return The current state.
     */
    get currentState(): TState;
    /**
     * Updates the finite state machine based on the provided input.
     * @param input - The input used to evaluate transitions.
     * @return True if a state transition occurred; otherwise, false.
     */
    update(input: TInput): boolean;
}
