/**
 * A sequence of functions run in order on an initial value: each function
 * receives the awaited result of the one before it.
 */
export class Chain {
    _functions = [];
    _initialState;
    /**
     * Creates a chain that starts from `initialState`.
     * @param initialState - The value passed to the first function.
     */
    constructor(initialState) {
        this._initialState = initialState;
    }
    /**
     * Appends a function to the chain.
     * @param fn - The function to run on the previous function's awaited result.
     * @returns This chain, typed with `fn`'s output.
     */
    add(fn) {
        this._functions.push(fn);
        return this;
    }
    /**
     * Runs every function in the order they were added, awaiting each one.
     * @returns The awaited result of the last function, or the initial value if
     * the chain has no functions.
     */
    async execute() {
        let result = this._initialState;
        for (const fn of this._functions) {
            // eslint-disable-next-line no-await-in-loop
            result = await fn(result);
        }
        return result;
    }
}
