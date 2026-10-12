import { Vector2, Vector3 } from '../../math/index.js';
import type { Color } from '../color.js';
import type { RenderContext } from '../render-context.js';
import type { ForgeShaderSource } from '../shaders/pre-processing/forge-shader-source.js';
import { UniformValue } from './uniform-value.js';
/**
 * A shader program plus the uniform values to draw with. Materials made
 * from the same two shaders share one linked program (see
 * `RenderContext.getShaderProgram`), so creating a material is cheap; each
 * material keeps its own uniform values, and binding it uploads them.
 *
 * A material's uniforms are the ones its shaders' sources declare, read
 * after `#pragma forge include(...)`s are resolved, from declarations of
 * the form `uniform [precision] <type> <name>[<size>], ...;` (or
 * `<type>[<size>] <name>`), with an optional `layout(...)` qualifier:
 * - An array's size is an integer literal, a `#define NAME <integer>` or a
 *   `const int NAME = <integer>;`. Any other size expression throws when
 *   the material is created.
 * - Two declarations of the same name, in one shader or across the two,
 *   must agree on type and size.
 * - `#if`/`#ifdef` blocks aren't evaluated, so a uniform declared in a
 *   branch that's compiled out can still be set, and is treated like a
 *   uniform the compiler removed.
 * - Uniform blocks (`uniform Block { ... };`) aren't supported.
 * - A struct uniform (`uniform Light u_light;`) can't be set by its own
 *   name; its members (`u_light.color`) can be set while the program uses
 *   them. The same applies to a uniform whose type is a macro
 *   (`uniform TINT_TYPE u_tint;`).
 */
export declare class Material {
    private readonly _shaderProgram;
    /** Pending uploads by uniform name (see `UniformDeclaration.name`). */
    private readonly _uniformUploads;
    /**
     * Constructs a new instance of the `Material` class.
     * @param renderContext - The render context to draw with. Its program
     * cache compiles and links the two shaders the first time any material
     * uses them.
     * @param vertexShaderSource - The vertex shader source.
     * @param fragmentShaderSource - The fragment shader source.
     * @throws An error if a shader fails to compile or link, if the two
     * shaders declare the same uniform with different types or sizes, or if
     * they declare a sampler other than `sampler2D`.
     */
    constructor(renderContext: RenderContext, vertexShaderSource: ForgeShaderSource, fragmentShaderSource: ForgeShaderSource);
    /**
     * The linked WebGL program, shared with every material made from the same
     * shaders.
     * @throws An error if the material was created while the WebGL context
     * is lost and the context hasn't been restored yet, so there's no program
     * to read. The engine's draw functions don't draw while the context is
     * lost (see `RenderContext.isContextLost`).
     */
    get program(): WebGLProgram;
    /**
     * Binds the material: uses its program and gives every uniform the
     * program kept a value, the material's own if it set one, and otherwise a
     * default (zero for numbers, vectors and matrices, the render context's
     * `blackTexture` for samplers). Textures are bound to consecutive texture
     * units from `0`.
     * @param gl - The WebGL2 rendering context.
     * @returns The first texture unit the material left free.
     */
    bind(gl: WebGL2RenderingContext): number;
    /**
     * Whether the material's shaders declare a uniform called `name`, so it
     * can be set (see {@link Material.setUniform}).
     * @param name - The uniform's name.
     * @returns `true` if the uniform can be set.
     */
    hasUniform(name: string): boolean;
    /**
     * Sets a uniform's value, uploaded on the next {@link Material.bind}.
     *
     * The GL upload is chosen from the uniform's declared GLSL type, and the
     * value must fit that type:
     * - `float`, `vecN`, `matN`, `matNxM`: a `Float32Array` (a `number` for
     *   `float`, a `Vector2` for `vec2`, a `Matrix3x3` for `mat3`).
     * - `int`, `ivecN`: an `Int32Array` (a `number` or `boolean` for `int`).
     * - `uint`, `uvecN`: a `Uint32Array` (a `number` for `uint`).
     * - `bool`, `bvecN`: an `Int32Array` (a `boolean` for `bool`).
     * - `sampler2D`: a `Texture`.
     *
     * A typed array must hold exactly one element's worth of components (4 for
     * a `vec4`, 16 for a `mat4`), or, for a uniform array, a whole number of
     * elements up to the declared size; a shorter array updates only the
     * leading elements. A uniform array can be addressed by its declared name
     * (`u_items`) or by the name WebGL reports for it (`u_items[0]`).
     *
     * Any uniform the material's shaders declare can be set, including one
     * the GLSL compiler removed because nothing reads it: its value is checked
     * and stored the same way, and there's nothing to upload. Members of a
     * struct uniform (`u_light.color`) can be set while the program keeps
     * them, which is only known once it's linked: a material created while
     * the WebGL context is lost can't set them until the context is restored.
     * @param name - The uniform's name.
     * @param value - The value to upload.
     * @throws An error if the shaders don't declare a uniform called `name`,
     * or if `value` doesn't fit the uniform's declared type.
     */
    setUniform(name: string, value: UniformValue): void;
    /**
     * Sets a `vec4` uniform from the color's RGBA values.
     * @param name - The uniform's name.
     * @param color - The color to upload.
     * @throws An error under the same conditions as {@link Material.setUniform}.
     */
    setColorUniform(name: string, color: Color): void;
    /**
     * Sets a `vec2` or `vec3` uniform from the vector's elements.
     * @param name - The uniform's name.
     * @param vector - The vector to upload.
     * @throws An error under the same conditions as {@link Material.setUniform}.
     */
    setVectorUniform(name: string, vector: Vector2 | Vector3): void;
    /**
     * Checks `value` against the uniform's declaration and stores it, to be
     * uploaded on the next {@link Material.bind}. What
     * {@link Material.setUniform} does, without any restriction a subclass
     * puts on which uniforms callers may set.
     * @param name - The uniform's name.
     * @param value - The value to upload.
     * @throws An error under the same conditions as {@link Material.setUniform}.
     */
    protected storeUniform(name: string, value: UniformValue): void;
}
