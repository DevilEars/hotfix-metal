import type { FontAtlasFileData } from './font-atlas-file-data.js';
/**
 * Validates that `json` is a well-formed, current-version
 * `FontAtlasFileData` object, throwing a descriptive error otherwise. This
 * is the boundary check for atlas files, which may be moddable/user-supplied
 * content rather than developer-authored assets.
 * @param json - The parsed JSON to validate.
 * @param sourcePath - The path the JSON was loaded from, for error messages.
 * @returns `json`, narrowed to `FontAtlasFileData`.
 * @throws An error if `json` is not a valid, current-version atlas file.
 */
export declare function validateFontAtlasFileData(json: unknown, sourcePath: string): FontAtlasFileData;
