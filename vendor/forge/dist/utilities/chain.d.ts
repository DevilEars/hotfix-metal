import { Prettify } from '../common/index.js';
/**
 * A sequence of functions run in order on an initial value: each function
 * receives the awaited result of the one before it.
 */
export declare class Chain<Input, Output = Input> {
    private readonly _functions;
    private readonly _initialState;
    /**
     * Creates a chain that starts from `initialState`.
     * @param initialState - The value passed to the first function.
     */
    constructor(initialState: Input);
    /**
     * Appends a function to the chain.
     * @param fn - The function to run on the previous function's awaited result.
     * @returns This chain, typed with `fn`'s output.
     */
    add<NextOutput>(fn: (input: Awaited<Output>) => NextOutput): Chain<Input, NextOutput>;
    /**
     * Runs every function in the order they were added, awaiting each one.
     * @returns The awaited result of the last function, or the initial value if
     * the chain has no functions.
     */
    execute(): Promise<Awaited<Prettify<Output>>>;
}
