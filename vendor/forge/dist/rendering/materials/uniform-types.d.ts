/**
 * Uploads a typed array to a uniform's location using the GL call that
 * matches the uniform's declared type.
 */
export type UniformArrayUpload<TArray> = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, data: TArray) => void;
/**
 * A `float`, `vecN` or `matN`/`matNxM` uniform, set from a `Float32Array`.
 */
export interface FloatUniformType {
    readonly kind: 'float';
    readonly glslName: string;
    readonly componentCount: number;
    readonly upload: UniformArrayUpload<Float32Array>;
}
/**
 * An `int`/`ivecN` or `bool`/`bvecN` uniform, set from an `Int32Array`.
 * WebGL uploads both through the `uniform*iv` family.
 */
export interface IntUniformType {
    readonly kind: 'int' | 'bool';
    readonly glslName: string;
    readonly componentCount: number;
    readonly upload: UniformArrayUpload<Int32Array>;
}
/**
 * A `uint`/`uvecN` uniform, set from a `Uint32Array`.
 */
export interface UintUniformType {
    readonly kind: 'uint';
    readonly glslName: string;
    readonly componentCount: number;
    readonly upload: UniformArrayUpload<Uint32Array>;
}
/**
 * A sampler uniform. Only a `sampler2D` can be given a value (a `Texture`);
 * a program declaring any other sampler type is rejected when it's linked.
 */
export interface SamplerUniformType {
    readonly kind: 'sampler';
    readonly glslName: string;
}
/**
 * The declared GLSL type of an active uniform, as reported by
 * `getActiveUniform`, with what it takes to upload a value to it.
 */
export type UniformType = FloatUniformType | IntUniformType | UintUniformType | SamplerUniformType;
/**
 * Looks up the declared type of an active uniform from the GL type enum
 * `getActiveUniform` reports for it.
 * @param glType - The `WebGLActiveInfo.type` of the uniform.
 * @returns The uniform type, or `null` if WebGL 2 doesn't define it as a
 * uniform type.
 */
export declare const getUniformType: (glType: GLenum) => UniformType | null;
/** A uniform type together with the GL type enum it's reported as. */
export interface GlslUniformType {
    readonly glType: GLenum;
    readonly uniformType: UniformType;
}
/**
 * Looks up a uniform type from the GLSL type name it's declared with.
 * @param glslName - The declared type name, e.g. `'vec4'` or `'sampler2D'`,
 * spelled the way `UniformSourceDeclaration.glslTypeName` reports it (`mat4`
 * rather than its alias `mat4x4`).
 * @returns The uniform type and its GL type enum, or `null` if `glslName`
 * isn't a WebGL 2 uniform type (for example, a struct's name).
 */
export declare const getUniformTypeByGlslName: (glslName: string) => GlslUniformType | null;
