/**
 * The current version of the `FontAtlasData`/`FontAtlasFileData` schema.
 * Bumped on any breaking change to that shape.
 */
export const CURRENT_FONT_ATLAS_FORMAT_VERSION = 2;
/**
 * Builds the lookup key `FontAtlasData.kerning` is keyed by for a pair of
 * adjacent glyphs.
 * @param leftCodePoint - The code point of the left glyph in the pair.
 * @param rightCodePoint - The code point of the right glyph in the pair.
 * @returns The kerning map key for this pair.
 */
export function getKerningPairKey(leftCodePoint, rightCodePoint) {
    return `${leftCodePoint}:${rightCodePoint}`;
}
