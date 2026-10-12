/**
 * The `Color` class represents a color that can be created using RGB(A) or HSL(A).
 *
 * Red, green and blue have no upper bound: a value above `1` is brighter
 * than white. Used as a tint, it brightens a sprite past its texture. On an
 * 8-bit render target or the canvas, each channel of the result is clamped
 * to full brightness when it's written. On an HDR render target
 * (`RENDER_TARGET_FORMAT.hdr`) the value survives to bloom and tone mapping.
 */
export declare class Color {
    private readonly _r;
    private readonly _g;
    private readonly _b;
    private readonly _a;
    /** White color constant rgba(1, 1, 1, 1) */
    static readonly white: Color;
    /** Black color constant rgba(0, 0, 0, 1) */
    static readonly black: Color;
    /** Red color constant rgba(1, 0, 0, 1) */
    static readonly red: Color;
    /** Green color constant rgba(0, 1, 0, 1) */
    static readonly green: Color;
    /** Blue color constant rgba(0, 0, 1, 1) */
    static readonly blue: Color;
    /** Transparent color constant rgba(0, 0, 0, 0) */
    static readonly transparent: Color;
    /**
     * Constructs a new `Color` instance using RGBA values.
     * @param r - The red component. `1` is full brightness; higher values are
     * brighter than white. Negative values are clamped to `0`.
     * @param g - The green component. `1` is full brightness; higher values
     * are brighter than white. Negative values are clamped to `0`.
     * @param b - The blue component. `1` is full brightness; higher values are
     * brighter than white. Negative values are clamped to `0`.
     * @param a - The alpha component (0-1), clamped to that range. Defaults to
     * 1 (fully opaque).
     */
    constructor(r: number, g: number, b: number, a?: number);
    /**
     * Creates a `Color` instance using HSLA values.
     * @param h - The hue (0-360).
     * @param s - The saturation (0-100).
     * @param l - The lightness (0-100).
     * @param a - The alpha component (0-1). Defaults to 1 (fully opaque).
     * @returns A new `Color` instance.
     * @throws An error if `s` or `l` is outside 0-100.
     */
    static fromHSLA(h: number, s: number, l: number, a?: number): Color;
    private static _hueToRGB;
    /**
     * Gets the red component of the color.
     */
    get r(): number;
    /**
     * Gets the green component of the color.
     */
    get g(): number;
    /**
     * Gets the blue component of the color.
     */
    get b(): number;
    /**
     * Gets the alpha component of the color.
     */
    get a(): number;
    /**
     * Converts the color to a CSS-compatible RGBA string. CSS colors can't be
     * brighter than white, so channels above `1` are written as `255`.
     * @returns The RGBA string (e.g., `rgba(255, 0, 0, 1)`).
     */
    toRGBAString(): string;
    /**
     * Converts the color to a glsl-compatible float32 array.
     * @returns The RGBA array (e.g. `[1, 0, 0, 1]` for red).
     */
    toFloat32Array(): Float32Array;
}
