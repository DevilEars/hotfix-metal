import { ShaderPreProcessor } from './shader-pre-processor';
import { UniformSourceDeclaration } from './uniform-declarations.js';
export interface ForgeShaderPragma {
    lineNumber: number;
    rawLine: string;
    identifier: string;
    values: string[];
}
/**
 * Represents a shader source file with metadata.
 */
export declare class ForgeShaderSource {
    readonly name: string;
    private readonly _rawSource;
    private readonly _pragmas;
    private _preparedSource;
    private _uniformDeclarations;
    /**
     * Constructs a new instance of the `ForgeShaderSource` class.
     * Parses the provided shader source code and extracts metadata.
     *
     * @param rawSource - The raw source code of the shader.
     * @throws {Error} If the shader source does not contain a valid #property name directive.
     * @throws {Error} If any #include or #property directive has invalid syntax.
     */
    constructor(rawSource: string);
    /**
     * Gets the raw, unprocessed source code of the shader.
     *
     * @returns The raw shader source code as provided to the constructor.
     */
    get rawSource(): string;
    /**
     * Gets the prepared source code of the shader.
     * This is the source code after any preprocessing steps, such as resolving includes.
     *
     * @returns The prepared shader source code.
     */
    get preparedSource(): string;
    /**
     * Gets the `uniform` declarations of the prepared source, by name. Parsed
     * on first access and cached until a pre-processor changes the source.
     *
     * @returns The declared uniforms, in declaration order.
     * @throws {Error} If a declaration's array size can't be resolved, or a
     * uniform is declared twice with different types or sizes.
     */
    get uniformDeclarations(): ReadonlyMap<string, UniformSourceDeclaration>;
    /**
     * Applies a single pre-processor to the shader source.
     * The pre-processor can modify the shader source, for example by resolving includes or other transformations.
     *
     * @param preProcessor - The pre-processor to apply.
     */
    applyPreProcessor(preProcessor: ShaderPreProcessor): void;
    /**
     * Applies multiple pre-processors to the shader source in sequence.
     * Each pre-processor can modify the shader source, for example by resolving includes or other transformations.
     *
     * @param preProcessors - An array of pre-processors to apply.
     */
    applyPreProcessors(preProcessors: ShaderPreProcessor[]): void;
    getPragmas(identifier: string): ForgeShaderPragma[];
    /**
     * Parses the raw shader source code line by line to extract metadata.
     * Processes #include and #property directives, and validates that a name property exists.
     *
     * @param source - The shader source code to parse.
     * @throws {Error} If the shader source does not contain a #property name directive.
     * @private
     */
    private _parseRawSource;
    /**
     * Processes a single line of shader source code.
     * Identifies and delegates parsing to appropriate handlers for #include and #property directives.
     *
     * @param line - The line of shader source to process.
     * @param lineNumber - The zero-based line number for error reporting.
     */
    private _processLine;
    /**
     * Parses a #pragma forge directive from a shader line.
     * Expected format: #pragma forge name(value)
     *
     * @param line - The line containing the #pragma forge directive.
     * @param lineNumber - The zero-based line number for error reporting.
     * @throws {Error} If the #pragma forge directive has invalid syntax.
     */
    private _parsePragma;
}
