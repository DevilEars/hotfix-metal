import { StorageBackend } from './storage-backend.js';
/**
 * Creates a backend that keeps values in memory only, so they're lost when
 * the page closes. For tests, or for a game that chooses to carry on
 * without storage after a `StorageError`. Each backend has its own values.
 * @returns The memory storage backend.
 */
export declare function createMemoryStorageBackend(): StorageBackend;
