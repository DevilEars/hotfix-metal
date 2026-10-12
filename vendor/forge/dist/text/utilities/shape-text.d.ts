import type { Vector2 } from '../../math/index.js';
import type { GlyphQuad } from '../components/text-mesh-component.js';
import { type FontAtlasData } from '../font-atlas/font-atlas-data.js';
/**
 * How far a `<b>` glyph's ink is thickened on every side, in ems - the
 * same synthetic ("faux") bold browsers and FreeType apply when a font has
 * no bold cut: the glyph's edge is pushed outwards, and its advance grows
 * by the added width so bold letters don't run into each other.
 */
export declare const FAUX_BOLD_EMBOLDEN = 0.02;
/**
 * Options for {@link shapeText}. Mirrors the shape-relevant subset of
 * `TextEcsComponent`.
 */
export interface ShapeTextOptions {
    /** Font size, in world units - the rendered em height. */
    size: number;
    /**
     * Extra spacing between adjacent glyphs on a line, in ems (multiplied by
     * `size`, so tracking scales with the text). A word gap gets one letter
     * space on top of the whitespace's own advance. Never added after a
     * line's last glyph, so it doesn't skew alignment. Defaults to `0`.
     */
    letterSpacing?: number;
    /** Multiplier on the font's authored line height. Defaults to `1`. */
    lineHeight?: number;
    /**
     * Horizontal alignment of each line within `maxWidth`. Defaults to
     * `'left'`. Irrelevant, and ignored, when `maxWidth` is unset - with no
     * container to align against, every unwrapped line is already exactly as
     * wide as the block itself.
     */
    horizontalAlign?: 'left' | 'center' | 'right' | 'justify';
    /**
     * Vertical alignment of the shaped block relative to its anchor (the
     * origin every glyph offset is relative to) - see
     * `TextDefaultedOptions.verticalAlign` for the precise semantics.
     * Defaults to `'top'`.
     */
    verticalAlign?: 'top' | 'middle' | 'bottom' | 'baseline' | 'capline';
    /**
     * Wraps at word boundaries when a line would exceed this width, in world
     * units. `undefined` (the default) never wraps.
     */
    maxWidth?: number;
    /**
     * Where the shaped block's local origin (`x = 0`, the point every glyph
     * offset is ultimately relative to) sits within the `horizontalAlign`
     * box, as a fraction of `maxWidth` from the box's left edge - `0` (the
     * default) means the origin *is* the box's left edge, `0.5` means it sits
     * at the box's horizontal center, and `1` at its right edge. Irrelevant
     * when `maxWidth` is unset, for the same reason `horizontalAlign` is (see
     * its own doc comment).
     *
     * This exists because a caller that positions the shaped block by a
     * center (or right) pivot - rather than a left edge - would otherwise get
     * `horizontalAlign`'s alignment box measured from the wrong point: e.g. a
     * `'center'`-aligned single line under a center pivot would end up
     * offset by half its own alignment box, since `x = 0` would land at the
     * box's center rather than its left edge. Defaults to `0`.
     */
    horizontalAlignPivot?: number;
    /**
     * Whether `<b>` and `<color=...>` tags in the text are parsed as markup.
     * `false` shapes the text exactly as written, tags included, for text a
     * player typed. Defaults to `true`.
     */
    richText?: boolean;
}
/** The pure-data result of shaping a string against a `FontAtlasData`. */
export interface ShapedText {
    /** One entry per visible glyph, across every line. */
    glyphs: GlyphQuad[];
    /** The shaped block's own bounds, in world units. */
    bounds: {
        width: number;
        height: number;
    };
    /**
     * Where a caret sits at every UTF-16 boundary of the shaped (tag-free)
     * text, from `0` (before the first character) to its length (after the
     * last): the final x and the line's baseline y, offset from the block's
     * anchor like `glyphs`, after alignment, justification and the vertical
     * offset. Whitespace and characters with no glyph get stops too. The
     * boundary inside a surrogate pair gets the position of the pair's start.
     */
    caretStops: Vector2[];
}
/**
 * Shapes a (possibly multi-line, possibly wrapped) string into glyph quads.
 * Splits on whitespace into words, greedily wraps them into lines against
 * `maxWidth` (see {@link wrapIntoLines}), then positions each line
 * according to `horizontalAlign`/`verticalAlign`/`lineHeight`.
 *
 * `justify` stretches the gaps between words to fill `maxWidth` exactly, on
 * every line except the last (a fully-justified last line of one or two
 * words reads as visibly, unintentionally stretched - most text engines
 * leave it left-aligned, and so does this one) and except lines with a
 * single word (nothing to stretch). It has no effect when `maxWidth` is
 * unset, since every line is then already exactly as wide as the block.
 *
 * `text` may contain rich text tags - `<b>...</b>` and
 * `<color=#rrggbb>...</color>`, see {@link parseRichText} - which are
 * stripped before shaping, so they never affect kerning or wrapping, and
 * set the style of the glyphs between them.
 *
 * Code points not present in `fontAtlasData.glyphs` are silently skipped
 * (no glyph quad, no advance) rather than throwing - a missing glyph in
 * player-supplied or localized text is a content problem, not a programming
 * error.
 * @param text - The string to shape, which may contain rich text tags.
 * @param fontAtlasData - The font atlas metrics to shape against.
 * @param options - Shaping options.
 * @returns The shaped glyph quads and the block's bounds.
 */
export declare function shapeText(text: string, fontAtlasData: FontAtlasData, options: ShapeTextOptions): ShapedText;
