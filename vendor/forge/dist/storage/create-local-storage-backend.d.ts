import { StorageBackend } from './storage-backend.js';
/**
 * Creates a backend that stores values in the browser's `localStorage`.
 * Every method does its work before it returns, so a write is stored even
 * if the page closes straight after. `localStorage` keys are shared by
 * every page of an origin, so prefix keys with the game's name.
 *
 * Creating the backend doesn't touch `localStorage`, so it can be created
 * where there's no `window`. Its methods reject with a
 * `StorageUnavailableError` when there's no `localStorage`, a
 * `StorageBlockedError` when it's blocked (a `SecurityError`), and a
 * `StorageFullError` when it's full (a `QuotaExceededError`). Any other
 * `Error` is rejected with as it is.
 * @returns The `localStorage` backend.
 */
export declare function createLocalStorageBackend(): StorageBackend;
