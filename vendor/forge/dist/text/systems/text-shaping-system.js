import { textId } from '../components/text-component.js';
import { textMeshId, } from '../components/text-mesh-component.js';
import { shapeText } from '../utilities/shape-text.js';
function isSameSnapshot(a, b) {
    return (a.text === b.text &&
        a.fontAtlas === b.fontAtlas &&
        a.size === b.size &&
        a.letterSpacing === b.letterSpacing &&
        a.lineHeight === b.lineHeight &&
        a.horizontalAlign === b.horizontalAlign &&
        a.verticalAlign === b.verticalAlign &&
        a.maxWidth === b.maxWidth &&
        a.horizontalAlignPivot === b.horizontalAlignPivot &&
        a.richText === b.richText);
}
/**
 * Creates a text shaping ECS system: turns dirty `TextEcsComponent`s into
 * `TextMeshEcsComponent`s (glyph quads + bounds), only re-shaping an
 * entity's text when a shape-relevant field has actually changed since the
 * last tick this system ran against it.
 * @returns The ECS system.
 */
export const createTextShapingEcsSystem = () => {
    const lastShapedSnapshotByComponent = new WeakMap();
    return {
        query: [textId],
        update: (world, { entities, components: [textComponents] }) => {
            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                const textComponent = textComponents[i];
                const snapshot = {
                    text: textComponent.text,
                    fontAtlas: textComponent.fontAtlas,
                    size: textComponent.size,
                    letterSpacing: textComponent.letterSpacing,
                    lineHeight: textComponent.lineHeight,
                    horizontalAlign: textComponent.horizontalAlign,
                    verticalAlign: textComponent.verticalAlign,
                    maxWidth: textComponent.maxWidth,
                    horizontalAlignPivot: textComponent.horizontalAlignPivot,
                    richText: textComponent.richText,
                };
                const lastSnapshot = lastShapedSnapshotByComponent.get(textComponent);
                const alreadyShaped = world.getComponent(entity, textMeshId) !== null;
                if (alreadyShaped &&
                    lastSnapshot &&
                    isSameSnapshot(lastSnapshot, snapshot)) {
                    continue;
                }
                const { glyphs, bounds, caretStops } = shapeText(textComponent.text, textComponent.fontAtlas.data, {
                    size: textComponent.size,
                    letterSpacing: textComponent.letterSpacing,
                    lineHeight: textComponent.lineHeight,
                    horizontalAlign: textComponent.horizontalAlign,
                    verticalAlign: textComponent.verticalAlign,
                    maxWidth: textComponent.maxWidth,
                    horizontalAlignPivot: textComponent.horizontalAlignPivot,
                    richText: textComponent.richText,
                });
                world.addComponent(entity, textMeshId, {
                    glyphs,
                    bounds,
                    caretStops,
                });
                lastShapedSnapshotByComponent.set(textComponent, snapshot);
            }
        },
    };
};
