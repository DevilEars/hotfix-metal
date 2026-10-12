import { ParameterizedForgeEvent } from '../events/index.js';
import { createLocalStorageBackend } from './create-local-storage-backend.js';
import { PersistentStateValueError } from './persistent-state-errors.js';
import { withDefaults } from '../utilities/with-defaults.js';
const defaultPersistentStateOptions = {
    validators: {},
    storage: createLocalStorageBackend(),
};
/**
 * Calls a backend method straight away, turning a synchronous throw into a
 * rejection: the promise executor runs synchronously and rejects with
 * whatever it throws. `Promise.resolve().then(operation)` would also catch
 * the throw, but would start the write a microtask late.
 */
const callBackend = (operation) => 
// eslint-disable-next-line sonarjs/prefer-promise-shorthand
new Promise((resolve) => {
    resolve(operation());
});
/**
 * Reads a stored entry, or an empty one if it isn't a JSON object: then
 * every field takes its default, and the first write replaces it.
 */
const parseEntry = (stored) => {
    let parsed;
    try {
        parsed = JSON.parse(stored);
    }
    catch {
        return {};
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return {};
    }
    return parsed;
};
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
export async function createPersistentState(name, defaults, options = {}) {
    const { validators, storage } = withDefaults(defaultPersistentStateOptions, options);
    const isValid = (field, value) => {
        if (!Object.hasOwn(defaults, field)) {
            return false;
        }
        const key = field;
        if (typeof value !== typeof defaults[key]) {
            return false;
        }
        if (typeof value === 'number' && !Number.isFinite(value)) {
            return false;
        }
        const validator = validators[key];
        return validator === undefined || validator(value);
    };
    for (const [field, value] of Object.entries(defaults)) {
        if (!isValid(field, value)) {
            throw new PersistentStateValueError(name, field, value);
        }
    }
    const stored = await callBackend(() => storage.get(name));
    let entry = stored === null ? {} : parseEntry(stored);
    const loaded = {};
    for (const field of Object.keys(defaults)) {
        if (!Object.hasOwn(entry, field)) {
            continue;
        }
        const value = entry[field];
        if (isValid(field, value)) {
            loaded[field] = value;
        }
    }
    let values = Object.freeze({ ...defaults, ...loaded });
    const onChange = new ParameterizedForgeEvent(`persistentState.${name}.onChange`);
    let writing = false;
    let nextWrite = null;
    const startWrite = () => {
        const isEmpty = Object.keys(entry).length === 0;
        const serialized = JSON.stringify(entry);
        writing = true;
        const write = callBackend(() => isEmpty ? storage.remove(name) : storage.set(name, serialized));
        const onSettled = () => {
            writing = false;
            if (nextWrite === null) {
                return;
            }
            const waiting = nextWrite;
            nextWrite = null;
            startWrite().then(() => {
                for (const pending of waiting) {
                    pending.resolve();
                }
            }, (error) => {
                for (const pending of waiting) {
                    pending.reject(error);
                }
            });
        };
        write.then(onSettled, onSettled);
        return write;
    };
    const queueWrite = () => {
        if (!writing) {
            return startWrite();
        }
        const waiting = nextWrite ?? [];
        nextWrite = waiting;
        return new Promise((resolve, reject) => {
            waiting.push({ resolve, reject });
        });
    };
    const applyValues = (newValues) => {
        values = Object.freeze(newValues);
        onChange.raise(values);
    };
    return {
        name,
        get values() {
            return values;
        },
        onChange,
        set: (changes) => {
            const entries = Object.entries(changes);
            for (const [field, value] of entries) {
                if (!isValid(field, value)) {
                    throw new PersistentStateValueError(name, field, value);
                }
            }
            entry = { ...entry, ...changes };
            applyValues({ ...values, ...changes });
            return queueWrite();
        },
        reset: () => {
            entry = {};
            applyValues({ ...defaults });
            return queueWrite();
        },
    };
}
