/**
 * Represents a 3x3 transformation matrix used for 2D graphics operations.
 * The matrix is stored in column-major order as a flat array of 9 numbers.
 *
 * Matrix layout:
 * [0 3 6]
 * [1 4 7]
 * [2 5 8]
 */
export declare class Matrix3x3 {
    /** The underlying matrix data stored as a flat array in column-major order */
    private _matrix;
    /**
     * Creates a new 3x3 matrix from the given array.
     * @param matrix - An array of 9 numbers representing the matrix in column-major order
     */
    constructor(matrix: number[]);
    /**
     * Gets the underlying matrix array.
     * @returns {Float32Array} The matrix data as a Float32Array in column-major order
     */
    get matrix(): Float32Array;
    /**
     * Applies a translation transformation to the matrix. Like `rotate` and
     * `scale`, it multiplies onto the right of the current matrix, so the last
     * transform applied is the first one applied to a point.
     * @param x - The x-coordinate translation
     * @param y - The y-coordinate translation
     * @returns This matrix for chaining
     */
    translate(x: number, y: number): this;
    /**
     * Applies a rotation transformation to the matrix.
     * @param radians - The rotation angle in radians
     * @returns This matrix for chaining
     */
    rotate(radians: number): this;
    /**
     * Applies a scale transformation to the matrix.
     * @param x - The x-axis scale factor
     * @param y - The y-axis scale factor
     * @returns This matrix for chaining
     */
    scale(x: number, y: number): this;
    /**
     * Resets the matrix to the identity matrix in place, without allocating a
     * new array.
     * @returns This matrix for chaining
     */
    resetToIdentity(): this;
    /**
     * Creates and returns an identity matrix. Every access creates a new matrix.
     * @returns {Matrix3x3} A new identity matrix
     */
    static get identity(): Matrix3x3;
}
