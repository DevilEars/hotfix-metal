/**
 * Compares two arrays for shallow equality: the same length, and each pair of
 * elements at the same index equal by `===`.
 * @param a - The first array to compare.
 * @param b - The second array to compare.
 * @returns True if the arrays are shallowly equal, false otherwise.
 */
export declare function shallowArraysEqual<T>(a: readonly T[], b: readonly T[]): boolean;
