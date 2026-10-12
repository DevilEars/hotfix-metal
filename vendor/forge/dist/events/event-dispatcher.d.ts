import type { ParameterizedForgeEvent } from './parameterized-forge-event.js';
/**
 * Stores `ParameterizedForgeEvent`s under string types, and raises the
 * events stored under a type when that type is dispatched.
 *
 * @template TData - The type of data associated with the events.
 */
export declare class EventDispatcher<TData> {
    /**
     * A map of event types to sets of event listeners.
     */
    private readonly _listeners;
    /**
     * Creates a new instance of the `EventDispatcher` class.
     */
    constructor();
    /**
     * Stores an event under the specified type. A type can have several
     * events, and adding an event that's already stored under the type does
     * nothing.
     *
     * @param type - The type of the event.
     * @param event - The event to raise when `type` is dispatched.
     */
    addEventListener(type: string, event: ParameterizedForgeEvent<TData>): void;
    /**
     * Removes an event from the specified type. The event stays stored under
     * any other types, and keeps its listeners. Does nothing if the event
     * isn't stored under the type.
     *
     * @param type - The type of the event.
     * @param event - The event to remove.
     */
    removeEventListener(type: string, event: ParameterizedForgeEvent<TData>): void;
    /**
     * Raises every event stored under the specified type, in the order they
     * were added, passing each one `data`. Does nothing if no event is stored
     * under the type.
     *
     * @param type - The type of the event.
     * @param data - The data associated with the event.
     */
    dispatchEvent(type: string, data: TData): void;
}
