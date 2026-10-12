type Listener = () => void;
/**
 * An event that can be raised and listened to.
 */
export declare class ForgeEvent {
    /**
     * The name of the event.
     */
    name: string;
    /**
     * The list of listeners registered to this event.
     */
    private _listeners;
    /**
     * Gets the list of listeners registered to this event, in the order they
     * were registered. This is the event's own array, not a copy: change it
     * with `registerListener`, `deregisterListener` and `clear`.
     */
    get listeners(): Listener[];
    /**
     * Creates a new event.
     * @param name - The name of the event.
     */
    constructor(name: string);
    /**
     * Registers a listener to the event. It's called on every later `raise`.
     * A function registered twice is called twice per `raise`.
     * @param listener - The listener to register.
     */
    registerListener(listener: Listener): void;
    /**
     * Deregisters a listener from the event, comparing functions by
     * reference. Every registration of `listener` is removed. A `raise`
     * already in progress still calls it if it hasn't reached it yet.
     * @param listener - The listener to deregister.
     */
    deregisterListener(listener: Listener): void;
    /**
     * Clears all listeners from the event.
     */
    clear(): void;
    /**
     * Raises the event, calling all registered listeners in the order they
     * were registered, before returning.
     * @throws The error a listener throws, after logging it with
     * `console.error`. The listeners after it aren't called.
     */
    raise(): void;
}
export {};
