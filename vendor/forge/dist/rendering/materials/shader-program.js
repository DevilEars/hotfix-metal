import { addUniformDeclaration, } from '../shaders/pre-processing/uniform-declarations.js';
import { createDefaultUniformUpload, } from './create-uniform-upload.js';
import { getUniformType, getUniformTypeByGlslName } from './uniform-types.js';
/**
 * WebGL reports a uniform array under its first element's name
 * (`u_items[0]`); stripping the suffix gives the name it's declared with.
 */
const arrayElementZeroSuffix = '[0]';
/** The only sampler type a `Texture` can be bound to. */
const supportedSamplerGlslName = 'sampler2D';
/**
 * A linked vertex + fragment shader pair and its uniform table: the
 * uniforms its shaders declare, and where the program keeps the active
 * ones. Shared by every `Material` made from the same two shaders, and
 * cached by the render context (see `RenderContext.getShaderProgram`), so
 * each shader pair compiles and links once, and again each time a lost
 * WebGL context is restored.
 */
export class ShaderProgram {
    /** A description of the program's shaders, for error messages. */
    description;
    /** The names of the uniforms its shaders declare, in declaration order. */
    declaredUniformNames;
    _renderContext;
    _vertexShaderSource;
    _fragmentShaderSource;
    _declaredUniforms;
    _program;
    _uniforms;
    _activeUniforms;
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
    constructor(renderContext, vertexShaderSource, fragmentShaderSource) {
        this.description = `material "${vertexShaderSource.name}" + "${fragmentShaderSource.name}"`;
        const declaredUniforms = new Map();
        this.declaredUniformNames = this._addDeclaredUniforms(declaredUniforms, vertexShaderSource, fragmentShaderSource);
        this._renderContext = renderContext;
        this._vertexShaderSource = vertexShaderSource;
        this._fragmentShaderSource = fragmentShaderSource;
        this._declaredUniforms = declaredUniforms;
        this._program = null;
        this._uniforms = declaredUniforms;
        this._activeUniforms = [];
        if (!renderContext.isContextLost) {
            this.link();
        }
    }
    /**
     * The linked WebGL program, or `null` if it was created while the WebGL
     * context was lost and hasn't been linked yet.
     */
    get program() {
        return this._program;
    }
    /**
     * Every uniform that can be set, by name: the declared uniforms, whether
     * or not the compiler kept them, and the active members of struct
     * uniforms. Arrays are reachable as `u_items` and `u_items[0]`. Struct
     * members are only known once the program is linked.
     */
    get uniforms() {
        return this._uniforms;
    }
    /**
     * Active uniforms in program order, each listed once. Empty until the
     * program is linked.
     */
    get activeUniforms() {
        return this._activeUniforms;
    }
    /**
     * Compiles and links the two shaders, replacing any previous program, and
     * reads where the program keeps its active uniforms. The render context
     * calls this when it creates the program and again when a lost WebGL
     * context is restored.
     * @throws An error if a shader fails to compile or link, or if the
     * program has an active sampler other than `sampler2D`.
     */
    link() {
        const { gl } = this._renderContext;
        const uniforms = new Map(this._declaredUniforms);
        this._program = this._createProgram(gl, this._vertexShaderSource.preparedSource, this._fragmentShaderSource.preparedSource);
        this._activeUniforms = this._addActiveUniforms(gl, this._program, uniforms);
        this._uniforms = uniforms;
    }
    _createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this._compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = this._compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        // A linked program keeps its own copy of the compiled code.
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        // Every status query reports failure on a lost context. The program is
        // linked again when the context is restored.
        if (!gl.getProgramParameter(program, gl.LINK_STATUS) &&
            !this._renderContext.isContextLost) {
            const log = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Failed to link ${this.description}: ${log}`);
        }
        return program;
    }
    _compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error(`Failed to create a shader for ${this.description}.`);
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) &&
            !this._renderContext.isContextLost) {
            const log = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compile error in ${this.description}: ${log}`);
        }
        return shader;
    }
    /**
     * Registers every uniform the two shaders declare, with the type and size
     * from its declaration. A struct-typed uniform isn't settable by its own
     * name; its active members are added by `_addActiveUniforms`.
     * @returns The declared uniforms' names, in declaration order.
     */
    _addDeclaredUniforms(uniforms, vertexShaderSource, fragmentShaderSource) {
        const declarations = new Map();
        const names = [];
        for (const source of [vertexShaderSource, fragmentShaderSource]) {
            for (const declaration of source.uniformDeclarations.values()) {
                addUniformDeclaration(declarations, declaration, this.description);
            }
        }
        for (const declaration of declarations.values()) {
            const glslType = getUniformTypeByGlslName(declaration.glslTypeName);
            if (glslType === null) {
                continue;
            }
            const { name } = declaration;
            this._assertSupportedSampler(name, glslType.uniformType.glslName, declaration.size);
            const uniform = {
                name,
                glType: glslType.glType,
                uniformType: glslType.uniformType,
                size: declaration.size,
            };
            names.push(name);
            uniforms.set(name, uniform);
            if (declaration.isArray) {
                uniforms.set(`${name}${arrayElementZeroSuffix}`, uniform);
            }
        }
        return names;
    }
    /**
     * Records where to upload each uniform the linked program kept, in
     * program order, and what to upload when a material hasn't set it. A
     * declared uniform keeps its declared type and size; anything else the
     * program reports (members of a struct uniform) is typed from what
     * `getActiveUniform` reports.
     */
    _addActiveUniforms(gl, program, uniforms) {
        const activeUniforms = [];
        // `null` on a lost context.
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) ??
            0;
        const blackTexture = () => this._renderContext.blackTexture;
        for (let i = 0; i < numUniforms; i++) {
            const info = gl.getActiveUniform(program, i);
            if (!info) {
                continue;
            }
            const location = gl.getUniformLocation(program, info.name);
            if (location === null) {
                continue;
            }
            const name = info.name.endsWith(arrayElementZeroSuffix)
                ? info.name.slice(0, -arrayElementZeroSuffix.length)
                : info.name;
            const uniform = uniforms.get(name) ?? {
                name,
                glType: info.type,
                uniformType: getUniformType(info.type),
                size: info.size,
            };
            if (uniform.uniformType) {
                this._assertSupportedSampler(name, uniform.uniformType.glslName, uniform.size);
            }
            uniforms.set(name, uniform);
            uniforms.set(info.name, uniform);
            activeUniforms.push({
                ...uniform,
                location,
                defaultUpload: createDefaultUniformUpload(uniform, blackTexture),
            });
        }
        return activeUniforms;
    }
    /**
     * Rejects a sampler a `Texture` can't be bound to. Every sampler gets a
     * texture unit on bind (`blackTexture` when unset), and two samplers of
     * different types on one unit fail the draw, so an unsupported sampler is
     * rejected up front rather than left unbound.
     */
    _assertSupportedSampler(name, glslName, size) {
        const isSampler = getUniformTypeByGlslName(glslName)?.uniformType.kind === 'sampler';
        if (!isSampler) {
            return;
        }
        if (glslName !== supportedSamplerGlslName) {
            throw new Error(`Uniform "${name}" in ${this.description} is declared as ${glslName}, but materials only support ${supportedSamplerGlslName} uniforms, the type a Texture is sampled through.`);
        }
        if (size > 1) {
            throw new Error(`Uniform "${name}" in ${this.description} is declared as ${glslName}[${size}], but materials don't support sampler arrays. Declare one sampler uniform per texture instead.`);
        }
    }
}
