import { Color } from '../../rendering/color.js';
/**
 * A range of characters in {@link RichText.text}, as UTF-16 code unit
 * indices: `start` is inclusive and `end` is exclusive.
 */
export interface TextRun {
    /** Index of the run's first character. */
    start: number;
    /** Index one past the run's last character. */
    end: number;
}
/** A range of characters drawn in a `<color=...>` tag's color. */
export interface ColorTextRun extends TextRun {
    /** The fill color, replacing `TextEcsComponent.color` (alpha included). */
    color: Color;
}
/**
 * A markup string split into its plain text and the style runs its tags
 * apply. Each run list is sorted and non-overlapping: nested tags of the
 * same kind are flattened, the innermost one winning.
 */
export interface RichText {
    /** The string with every tag removed. This is the text that's shaped. */
    text: string;
    /** The ranges of `text` inside a `<color=...>` tag. */
    colorRuns: ColorTextRun[];
    /** The ranges of `text` inside a `<b>` tag. */
    boldRuns: TextRun[];
}
/**
 * Splits a string containing rich text tags into its plain text and the
 * style runs the tags apply over that text's character indices.
 *
 * Two tags are supported: `<b>...</b>` draws its text bold and
 * `<color=#rrggbb>...</color>` draws it in a color (`#rgb`, `#rgba` and
 * `#rrggbbaa` work too). Tags nest, and the innermost color wins.
 *
 * Markup that isn't one of those tags is kept as literal text, never an
 * error, since text often comes from players or translations: a `<` that
 * doesn't start a complete `<name>`, `<name=value>` or `</name>`
 * (`HP < 50%`, `a<3`), an unknown tag (`<i>`), an invalid value
 * (`<color=red>`) and a closing tag with nothing of its name open. There's
 * no escape syntax, so the exact text `<b>` can't be shown. A tag left open
 * runs to the end of the string.
 * @param markup - The string to parse.
 * @returns The plain text and its style runs.
 */
export declare function parseRichText(markup: string): RichText;
