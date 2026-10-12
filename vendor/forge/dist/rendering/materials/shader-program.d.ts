import type { RenderContext } from '../render-context.js';
import type { ForgeShaderSource } from '../shaders/pre-processing/forge-shader-source.js';
import { UniformDeclaration, UniformUpload } from './create-uniform-upload.js';
/**
 * A uniform the linked program kept: where to upload its value, and what to
 * upload when a material hasn't set one.
 */
export interface ActiveUniform extends UniformDeclaration {
    readonly location: WebGLUniformLocation;
    readonly defaultUpload: UniformUpload | null;
}
/**
 * A linked vertex + fragment shader pair and its uniform table: the
 * uniforms its shaders declare, and where the program keeps the active
 * ones. Shared by every `Material` made from the same two shaders, and
 * cached by the render context (see `RenderContext.getShaderProgram`), so
 * each shader pair compiles and links once, and again each time a lost
 * WebGL context is restored.
 */
export declare class ShaderProgram {
    /** A description of the program's shaders, for error messages. */
    readonly description: string;
    /** The names of the uniforms its shaders declare, in declaration order. */
    readonly declaredUniformNames: readonly string[];
    private readonly _renderContext;
    private readonly _vertexShaderSource;
    private readonly _fragmentShaderSource;
    private readonly _declaredUniforms;
    private _program;
    private _uniforms;
    private _activeUniforms;
    /**
     * Reads the uniforms the two shaders declare, then compiles and links
     * them, unless the render context's WebGL context is lost, in which case
     * they're linked when it's restored.
     * @param renderContext - The render context the program belongs to.
     * @param vertexShaderSource - The vertex shader source.
     * @param fragmentShaderSource - The fragment shader source.
     * @throws An error if a shader fails to compile or link, if the two
     * shaders declare the same uniform with different types or sizes, or if
     * they declare a sampler other than `sampler2D`.
     */
    constructor(renderContext: RenderContext, vertexShaderSource: ForgeShaderSource, fragmentShaderSource: ForgeShaderSource);
    /**
     * The linked WebGL program, or `null` if it was created while the WebGL
     * context was lost and hasn't been linked yet.
     */
    get program(): WebGLProgram | null;
    /**
     * Every uniform that can be set, by name: the declared uniforms, whether
     * or not the compiler kept them, and the active members of struct
     * uniforms. Arrays are reachable as `u_items` and `u_items[0]`. Struct
     * members are only known once the program is linked.
     */
    get uniforms(): ReadonlyMap<string, UniformDeclaration>;
    /**
     * Active uniforms in program order, each listed once. Empty until the
     * program is linked.
     */
    get activeUniforms(): readonly ActiveUniform[];
    /**
     * Compiles and links the two shaders, replacing any previous program, and
     * reads where the program keeps its active uniforms. The render context
     * calls this when it creates the program and again when a lost WebGL
     * context is restored.
     * @throws An error if a shader fails to compile or link, or if the
     * program has an active sampler other than `sampler2D`.
     */
    link(): void;
    private _createProgram;
    private _compileShader;
    /**
     * Registers every uniform the two shaders declare, with the type and size
     * from its declaration. A struct-typed uniform isn't settable by its own
     * name; its active members are added by `_addActiveUniforms`.
     * @returns The declared uniforms' names, in declaration order.
     */
    private _addDeclaredUniforms;
    /**
     * Records where to upload each uniform the linked program kept, in
     * program order, and what to upload when a material hasn't set it. A
     * declared uniform keeps its declared type and size; anything else the
     * program reports (members of a struct uniform) is typed from what
     * `getActiveUniform` reports.
     */
    private _addActiveUniforms;
    /**
     * Rejects a sampler a `Texture` can't be bound to. Every sampler gets a
     * texture unit on bind (`blackTexture` when unset), and two samplers of
     * different types on one unit fail the draw, so an unsupported sampler is
     * rejected up front rather than left unbound.
     */
    private _assertSupportedSampler;
}
