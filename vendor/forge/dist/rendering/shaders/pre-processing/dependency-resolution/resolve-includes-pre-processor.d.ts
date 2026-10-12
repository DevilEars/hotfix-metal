import { ForgeShaderSource } from '../forge-shader-source';
import { ShaderPreProcessor } from '../shader-pre-processor';
export declare class ResolveIncludesPreProcessor implements ShaderPreProcessor {
    private readonly _includeMap;
    constructor(includeMap: ForgeShaderSource[]);
    process(shader: ForgeShaderSource): string;
    private _resolveIncludes;
    private _processLine;
    private _isIncludeLine;
    private _processIncludeLine;
    private _isVariableDeclarationLine;
    private _processVariableDeclarationLine;
    private _isPropertyLine;
    private _processPropertyLine;
}
