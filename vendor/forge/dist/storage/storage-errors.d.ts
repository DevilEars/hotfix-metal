/**
 * What every `StorageBackend` rejects with when storage fails. The error
 * that caused it, if any, is its `cause`.
 */
export declare class StorageError extends Error {
    /**
     * Creates a storage error.
     * @param message - What failed.
     * @param cause - The error that caused it, if any.
     */
    constructor(message: string, cause?: unknown);
}
/**
 * There's no storage to use: no `localStorage` in this environment, or an
 * endpoint that can't be reached.
 */
export declare class StorageUnavailableError extends StorageError {
    /**
     * Creates a storage unavailable error.
     * @param message - What failed.
     * @param cause - The error that caused it, if any.
     */
    constructor(message: string, cause?: unknown);
}
/**
 * Storage exists but is blocked: by the browser's settings, a frame that's
 * denied storage, or private browsing.
 */
export declare class StorageBlockedError extends StorageError {
    /**
     * Creates a storage blocked error.
     * @param message - What failed.
     * @param cause - The error that caused it, if any.
     */
    constructor(message: string, cause?: unknown);
}
/**
 * Storage is full.
 */
export declare class StorageFullError extends StorageError {
    /**
     * Creates a storage full error.
     * @param message - What failed.
     * @param cause - The error that caused it, if any.
     */
    constructor(message: string, cause?: unknown);
}
