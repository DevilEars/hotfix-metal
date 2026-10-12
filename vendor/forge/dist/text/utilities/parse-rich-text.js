import { Color } from '../../rendering/color.js';
/**
 * Matches one complete tag starting at the current position: `<name>`,
 * `<name=value>` or `</name>`. Anything else starting with `<` (a lone `<`,
 * `<` followed by a space or digit, an unterminated `<b`) is literal text.
 */
const tagPattern = /<(\/?)([A-Za-z][A-Za-z0-9-]*)(?:=([^<>]*))?>/y;
const hexColorPattern = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
/**
 * Parses a `<color=...>` tag's value. Accepts `#rgb`, `#rgba`, `#rrggbb` and
 * `#rrggbbaa`; a value without alpha is fully opaque.
 * @param value - The tag's value, after the `=`.
 * @returns The color the value names, or `null` if it isn't one of the
 * accepted hex forms.
 */
function parseHexColor(value) {
    if (!hexColorPattern.test(value)) {
        return null;
    }
    const digits = value.slice(1);
    const isShortForm = digits.length <= 4;
    const channelLength = isShortForm ? 1 : 2;
    const channels = [];
    for (let i = 0; i < digits.length; i += channelLength) {
        const channel = digits.slice(i, i + channelLength);
        const expanded = isShortForm ? channel + channel : channel;
        channels.push(Number.parseInt(expanded, 16) / 255);
    }
    const [r, g, b, a = 1] = channels;
    return new Color(r, g, b, a);
}
/**
 * Appends `run` to `runs`, extending the last run instead when the two
 * touch and carry the same style, so a style split only by a tag that
 * didn't change it (`<b>a<b>b</b></b>`) stays one run.
 * @param runs - The run list to append to.
 * @param run - The run to append.
 * @param isSameStyle - Whether two runs carry the same style.
 */
function appendRun(runs, run, isSameStyle) {
    if (run.end <= run.start) {
        return;
    }
    const previous = runs.at(-1);
    if (previous?.end === run.start && isSameStyle(previous, run)) {
        previous.end = run.end;
        return;
    }
    runs.push(run);
}
/**
 * Applies one tag-shaped piece of markup to the stack of open tags.
 * @param isClosing - Whether the tag is a closing tag (`</name>`).
 * @param name - The tag's name.
 * @param value - The tag's value, if it has one.
 * @param openTags - The stack of currently open tags, modified in place.
 * @returns `false` if the markup isn't a tag this parser accepts (an
 * unknown name, a missing or invalid value, or a closing tag with nothing
 * of that name open), in which case it's literal text and `openTags` is
 * unchanged.
 */
function applyTag(isClosing, name, value, openTags) {
    if (name !== 'b' && name !== 'color') {
        return false;
    }
    if (isClosing) {
        // Closes the innermost open tag of the same name, even when another
        // kind of tag was opened inside it: bold and color are independent, so
        // `<b><color=#f00>a</b>b</color>` still has a clear meaning.
        const openIndex = openTags.findLastIndex((tag) => tag.name === name);
        if (value !== undefined || openIndex === -1) {
            return false;
        }
        openTags.splice(openIndex, 1);
        return true;
    }
    if (name === 'b') {
        if (value !== undefined) {
            return false;
        }
        openTags.push({ name });
        return true;
    }
    const color = value === undefined ? null : parseHexColor(value);
    if (!color) {
        return false;
    }
    openTags.push({ name, color });
    return true;
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
export function parseRichText(markup) {
    const colorRuns = [];
    const boldRuns = [];
    const openTags = [];
    let text = '';
    let segmentStart = 0;
    let index = 0;
    // Closes the run of plain text written since the last tag, under the
    // style the open tags gave it.
    const flushSegment = () => {
        const run = { start: segmentStart, end: text.length };
        const color = openTags.findLast((tag) => tag.color)?.color;
        if (color) {
            appendRun(colorRuns, { ...run, color }, (a, b) => a.color === b.color);
        }
        if (openTags.some((tag) => tag.name === 'b')) {
            appendRun(boldRuns, run, () => true);
        }
        segmentStart = text.length;
    };
    while (index < markup.length) {
        const nextTagStart = markup.indexOf('<', index);
        if (nextTagStart === -1) {
            text += markup.slice(index);
            break;
        }
        tagPattern.lastIndex = nextTagStart;
        const match = tagPattern.exec(markup);
        text += markup.slice(index, nextTagStart);
        flushSegment();
        if (!match) {
            text += '<';
            index = nextTagStart + 1;
            continue;
        }
        const [tag, closingSlash, name, value] = match;
        if (!applyTag(closingSlash === '/', name, value, openTags)) {
            text += tag;
        }
        index = nextTagStart + tag.length;
    }
    flushSegment();
    return { text, colorRuns, boldRuns };
}
