/**
 * Converts the on-disk `FontAtlasFileData` shape into the runtime,
 * `Map`-based `FontAtlasData` shape.
 * @param fileData - The parsed and validated on-disk atlas data.
 * @returns The runtime font atlas data.
 */
export function toFontAtlasData(fileData) {
    return {
        formatVersion: fileData.formatVersion,
        type: fileData.type,
        atlasSize: fileData.atlasSize,
        distanceRange: fileData.distanceRange,
        metrics: fileData.metrics,
        glyphs: new Map(fileData.glyphs.map((glyph) => [glyph.codePoint, glyph])),
        kerning: new Map(Object.entries(fileData.kerning)),
    };
}
