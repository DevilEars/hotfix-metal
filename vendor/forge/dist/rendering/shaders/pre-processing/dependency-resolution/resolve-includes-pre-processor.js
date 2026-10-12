import { isUniformDeclarationLine } from '../uniform-declarations.js';
export class ResolveIncludesPreProcessor {
    _includeMap;
    constructor(includeMap) {
        this._includeMap = includeMap;
    }
    process(shader) {
        return this._resolveIncludes(shader);
    }
    _resolveIncludes(source, includesAlreadyResolved = [], resolvedVariables = new Set()) {
        const lines = source.rawSource.split('\n');
        const processedLines = lines
            .map((line, lineNumber) => this._processLine(source, line, lineNumber, includesAlreadyResolved, resolvedVariables))
            .join('\n');
        // Remove consecutive empty lines
        return processedLines.replaceAll(/^[ \t]*$(?:\r\n?|\n){2,}/gm, '\n');
    }
    _processLine(source, line, lineNumber, includesAlreadyResolved, resolvedVariables) {
        if (this._isIncludeLine(line)) {
            return this._processIncludeLine(source, line, lineNumber, includesAlreadyResolved, resolvedVariables);
        }
        if (this._isVariableDeclarationLine(line)) {
            return this._processVariableDeclarationLine(line, resolvedVariables);
        }
        if (this._isPropertyLine(line)) {
            return this._processPropertyLine();
        }
        return line;
    }
    _isIncludeLine(line) {
        return /#pragma\s+forge\s+include/.test(line);
    }
    _processIncludeLine(source, line, lineNumber, includesAlreadyResolved, resolvedVariables) {
        const match = RegExp(/#pragma\s+forge\s+include\s*\(\s*(\w+)\s*\)/).exec(line);
        if (!match) {
            const column = line.search(/#pragma\s+forge\s+include/) + 1;
            throw new Error(`Invalid shader syntax at line ${lineNumber + 1}:${column}. Expected "#pragma forge include(name)" but got "${line.trim()}" when resolving "${source.name}"`);
        }
        const [fullMatch, name] = match;
        const column = line.indexOf(fullMatch) + 1;
        if (!name) {
            throw new Error(`Invalid shader syntax at line ${lineNumber + 1}:${column}. Expected "#pragma forge include(name)" but got "${fullMatch}" when resolving "${source.name}"`);
        }
        if (includesAlreadyResolved.includes(name)) {
            return '';
        }
        const includeSource = this._includeMap.find((include) => include.name === name);
        if (!includeSource) {
            throw new Error(`Missing include for shader: "${name}" at line ${lineNumber + 1}:${column} when resolving "${source.name}"`);
        }
        includesAlreadyResolved.push(name);
        const resolvedContent = this._resolveIncludes(includeSource, includesAlreadyResolved, resolvedVariables);
        const continuationLine = lineNumber + 2;
        return `#line 1\n${resolvedContent}\n#line ${continuationLine}`;
    }
    _isVariableDeclarationLine(line) {
        return isUniformDeclarationLine(line) || /^\s*in\s+\w+\s+\w+;/.test(line);
    }
    _processVariableDeclarationLine(line, resolvedVariables) {
        if (resolvedVariables.has(line.trim())) {
            return ''; // Skip duplicate declarations
        }
        resolvedVariables.add(line.trim());
        return line;
    }
    _isPropertyLine(line) {
        return line.includes('#property');
    }
    _processPropertyLine() {
        return '';
    }
}
