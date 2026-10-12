/**
 * An event that can be raised and listened to, passing a value to its
 * listeners.
 *
 * @template TInput - The type of the input parameter for the listeners.
 */
export class ParameterizedForgeEvent {
    /**
     * The name of the event.
     */
    name;
    /**
     * The list of listeners registered to this event.
     */
    _listeners;
    /**
     * Gets the list of listeners registered to this event, in the order they
     * were registered. This is the event's own array, not a copy: change it
     * with `registerListener`, `deregisterListener` and `clear`.
     */
    get listeners() {
        return this._listeners;
    }
    /**
     * Creates a new ParameterizedEvent instance.
     * @param name - The name of the event.
     */
    constructor(name) {
        this.name = name;
        this._listeners = [];
    }
    /**
     * Registers a listener to the event. It's called on every later `raise`.
     * A function registered twice is called twice per `raise`.
     * @param listener - The listener to register.
     */
    registerListener(listener) {
        this._listeners.push(listener);
    }
    /**
     * Deregisters a listener from the event, comparing functions by
     * reference. Every registration of `listener` is removed. A `raise`
     * already in progress still calls it if it hasn't reached it yet.
     * @param listener - The listener to deregister.
     */
    deregisterListener(listener) {
        this._listeners = this._listeners.filter((l) => l !== listener);
    }
    /**
     * Clears all listeners from the event.
     */
    clear() {
        this._listeners = [];
    }
    /**
     * Raises the event, calling all registered listeners with the provided
     * input, in the order they were registered, before returning.
     * @param input - The input parameter to pass to the listeners.
     * @throws The error a listener throws, after logging it with
     * `console.error`. The listeners after it aren't called.
     */
    raise(input) {
        for (const listener of this._listeners) {
            try {
                listener(input);
            }
            catch (error) {
                console.error(`Error in listener for event ${this.name}:`, error);
                throw error;
            }
        }
    }
}
