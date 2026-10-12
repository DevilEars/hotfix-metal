import { Texture } from '../texture.js';
import type { UniformType } from './uniform-types.js';
import { UniformValue } from './uniform-value.js';
/**
 * A uniform's type and size: from its declaration in the shader source, or,
 * for a member of a struct uniform, as reported by `getActiveUniform`.
 */
export interface UniformDeclaration {
    /** The uniform's name, without the `[0]` suffix WebGL gives arrays. */
    readonly name: string;
    /** The GL type enum of the uniform's type. */
    readonly glType: GLenum;
    /** The uniform's declared type, or `null` if it isn't a known WebGL 2 type. */
    readonly uniformType: UniformType | null;
    /** The number of array elements, `1` for a uniform that isn't an array. */
    readonly size: number;
}
/**
 * Uploads a uniform's value to `location` on the currently bound program.
 * @returns The next free texture unit (`textureUnit` itself unless the
 * upload bound a texture).
 */
export type UniformUpload = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, textureUnit: number) => number;
/**
 * Validates a value against a uniform's declaration and builds the upload
 * that sends it to the GPU when the material is bound.
 *
 * The GL call is chosen from the uniform's declared type, never from the
 * shape of the value, so a 16-float array goes to a `vec4[4]` as four
 * `vec4`s and to a `mat4` as a matrix. A typed array must hold a whole
 * number of elements of the declared type: exactly one for a uniform that
 * isn't an array, or between one and the declared array size for an array
 * (a shorter array updates the leading elements only).
 * @param declaration - The uniform to upload to.
 * @param value - The value to upload.
 * @returns The upload to run on bind.
 * @throws An error if the value can't be assigned to the uniform's declared
 * type.
 */
export declare const createUniformUpload: (declaration: UniformDeclaration, value: UniformValue) => UniformUpload;
/**
 * Builds an upload that binds `texture` to the next free texture unit and
 * points a `sampler2D` uniform at it.
 * @param texture - The texture to bind.
 * @returns The upload.
 */
export declare const createTextureUpload: (texture: Texture) => UniformUpload;
/**
 * Builds the upload for a uniform a material hasn't set: zero for numbers,
 * vectors and matrices, and `blackTexture` for a `sampler2D`. Every uniform
 * of a shared program gets a value on every bind, so one material never
 * draws with a value another material set.
 * @param declaration - The uniform to upload to.
 * @param blackTexture - The texture an unset sampler samples.
 * @returns The upload, or `null` for a uniform whose type can't be
 * uploaded.
 */
export declare const createDefaultUniformUpload: (declaration: UniformDeclaration, blackTexture: () => Texture) => UniformUpload | null;
