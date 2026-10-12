/**
 * A `uniform` declared in a shader's source.
 */
export interface UniformSourceDeclaration {
    /** The declared name, without any `[n]` suffix. */
    readonly name: string;
    /**
     * The declared GLSL type name, e.g. `'vec4'` or `'sampler2D'`. The
     * `mat2x2`, `mat3x3` and `mat4x4` aliases are reported as `mat2`, `mat3`
     * and `mat4`. A struct-typed uniform reports its struct's name.
     */
    readonly glslTypeName: string;
    /** Whether the uniform is declared as an array, even one of size `1`. */
    readonly isArray: boolean;
    /** The array size, `1` for a uniform that isn't an array. */
    readonly size: number;
}
/**
 * Whether a line of GLSL is a complete `uniform` declaration statement
 * (not a uniform block), such as `uniform highp vec4 u_waves[4], u_color;`.
 * Recognizes exactly the statements {@link parseUniformDeclarations} reads.
 * @param line - The line to test.
 * @returns `true` if the line declares one or more uniforms.
 */
export declare const isUniformDeclarationLine: (line: string) => boolean;
/**
 * Reads the `uniform` declarations out of a GLSL source.
 *
 * Comments are ignored. Array sizes can be integer literals, or names
 * defined by `#define NAME <integer>` or `const int NAME = <integer>;`.
 * Both array spellings (`vec4 u_x[4]` and `vec4[4] u_x`), several
 * declarators in one statement, precision qualifiers and `layout(...)`
 * qualifiers are accepted. Uniform blocks (`uniform Block { ... };`) are
 * skipped. Preprocessor conditionals aren't evaluated, so a uniform declared
 * inside an inactive `#if` branch is still reported.
 * @param source - The GLSL source, with `#include`s already resolved.
 * @param shaderName - The shader's name, used in error messages.
 * @returns The declarations by name, in declaration order.
 * @throws An error if an array size isn't an integer literal, `#define` or
 * `const int`, if a declaration can't be read, or if the same name is
 * declared twice with a different type or size.
 */
export declare const parseUniformDeclarations: (source: string, shaderName: string) => ReadonlyMap<string, UniformSourceDeclaration>;
/**
 * Adds a declaration, allowing an identical redeclaration (e.g. in both
 * branches of an `#if`) and rejecting a conflicting one.
 * @throws An error if `name` is already declared with a different type or
 * size.
 * @param declarations - The declarations found so far, by name.
 * @param declaration - The declaration to add.
 * @param sourceDescription - Where the declarations come from, for the
 * error message (e.g. `shader "sprite.frag"`).
 */
export declare const addUniformDeclaration: (declarations: Map<string, UniformSourceDeclaration>, declaration: UniformSourceDeclaration, sourceDescription: string) => void;
