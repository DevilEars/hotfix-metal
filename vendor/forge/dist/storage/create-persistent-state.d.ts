import { ParameterizedForgeEvent } from '../events/index.js';
import { StorageBackend } from './storage-backend.js';
/**
 * A value a persistent state can hold. Structured data can be stored as a
 * JSON string.
 */
export type PersistentValue = number | string | boolean;
/**
 * The shape of a persistent state's values: an object whose every field is
 * a {@link PersistentValue}. Written as a mapped type so interfaces are
 * accepted as well as type aliases.
 */
export type PersistentValues<T> = {
    [K in keyof T]: PersistentValue;
};
/**
 * Checks a value beyond "same type as the default", for example that a
 * number is in a range or a string is one of a set.
 */
export type PersistentValueValidator<TValue> = (value: unknown) => value is TValue;
/**
 * A named record of flat values kept outside the game, loaded once by
 * {@link createPersistentState} and stored through a `StorageBackend` on
 * every change.
 */
export interface PersistentState<T extends PersistentValues<T>> {
    /** The name the record is stored under. */
    readonly name: string;
    /**
     * The current values: the stored ones, and defaults for fields that
     * aren't stored. Replaced, not mutated, on every change, so read it from
     * the record rather than keeping a reference.
     */
    readonly values: Readonly<T>;
    /** Raised after every `set` or `reset`, with the new values. */
    readonly onChange: ParameterizedForgeEvent<Readonly<T>>;
    /**
     * Applies `changes` to `values` at once, raises `onChange` and stores
     * the changed fields. If storing fails, the changes stay applied, and
     * the next write that succeeds stores them.
     * @param changes - The fields to change.
     * @returns A promise that resolves once the changes are stored. Rejects
     * with the backend's error if they can't be.
     * @throws `PersistentStateValueError` if a value doesn't have its
     * default's type, isn't a finite number, or fails its validator. Nothing
     * is applied then.
     */
    set(changes: Partial<T>): Promise<void>;
    /**
     * Makes every value its default again, raises `onChange` and removes the
     * stored entry.
     * @returns A promise that resolves once the entry is removed. Rejects
     * with the backend's error if it can't be.
     */
    reset(): Promise<void>;
}
/**
 * Options for {@link createPersistentState}.
 */
export interface PersistentStateOptions<T extends PersistentValues<T>> {
    /**
     * Per-field checks beyond "same type as the default". A value passed to
     * `set` that fails its field's validator is an error, and a stored value
     * that fails it is ignored, so its field takes its default.
     */
    validators: {
        [K in keyof T]?: PersistentValueValidator<T[K]>;
    };
    /** Where the record is stored. Defaults to `localStorage`. */
    storage: StorageBackend;
}
/**
 * Creates a persistent state: a named record of flat values (numbers,
 * strings and booleans) with defaults, kept outside the game through a
 * `StorageBackend`, `localStorage` by default.
 *
 * The stored entry is read once, here. A field that isn't stored takes its
 * default, and so does a stored field that fails the checks a value passed
 * to `set` must pass (written by an earlier version of the game with other
 * defaults or validators, or edited by hand), or every field when the entry
 * isn't a JSON object. A stored value that fails its checks stays stored
 * until its field is set. Only fields passed to `set` are stored, as a JSON object under
 * `name`, so a default changed in a later version of the game reaches
 * everyone who never set that field. Stored fields this version doesn't
 * know are kept. Use one record per `name`, prefixed with the game's name:
 * two records with one name overwrite each other's entry, and
 * `localStorage` keys are shared by every page of an origin.
 *
 * Writes go out one at a time, in order. A change made while a write is in
 * flight goes out with the next write, so a backend that settles out of
 * order can't store older values over newer ones. With the `localStorage`
 * backend, a change is stored before `set` returns.
 * @param name - The key the record is stored under.
 * @param defaults - Every field of the record, with the value it has when
 * it isn't stored.
 * @param options - The validators and the storage backend.
 * @returns A promise that resolves with the record once its entry is
 * read. Rejects with the backend's error if the entry can't be read, and
 * with a `PersistentStateValueError` if a default isn't a finite number
 * where it should be or fails its validator.
 */
export declare function createPersistentState<T extends PersistentValues<T>>(name: string, defaults: T, options?: Partial<PersistentStateOptions<T>>): Promise<PersistentState<T>>;
