/** A DOM rectangle: CSS pixels, origin at the container's top-left, Y down. */
export interface CssRect {
    /** Distance from the container's left edge, in CSS pixels. */
    left: number;
    /** Distance from the container's top edge, in CSS pixels. */
    top: number;
    /** Width, in CSS pixels. */
    width: number;
    /** Height, in CSS pixels. */
    height: number;
}
/**
 * The HTML attributes a text entry's hidden `<input>` carries. Phone
 * keyboards read them when the input is focused, and screen readers
 * announce `ariaLabel`. Leave a field `undefined` to use the browser's
 * default.
 */
export interface TextEntryAttributes {
    /** The input's accessible name (`aria-label`), announced by screen readers. */
    ariaLabel?: string;
    /** Which on-screen keyboard to show (`inputmode`), e.g. `'numeric'`. */
    inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    /** Whether and how the browser may autofill the input (`autocomplete`), e.g. `'off'` or `'nickname'`. */
    autocomplete?: string;
    /** How phone keyboards capitalize what's typed (`autocapitalize`). */
    autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
    /** The label of a phone keyboard's Enter key (`enterkeyhint`). */
    enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
    /**
     * The most UTF-16 code units the player can type (`maxlength`). A
     * non-finite value means no limit.
     */
    maxLength?: number;
}
/** What happened to a text entry since the last {@link TextEntry.takeEvents}. */
export interface TextEntryEvents {
    /** The value changed through typing, pasting or an IME. */
    changed: boolean;
    /** Enter was pressed outside an IME composition. */
    submitted: boolean;
    /** Escape was pressed outside an IME composition. */
    cancelled: boolean;
    /** The browser took focus away (a click elsewhere, a phone's "Done", a tab switch). */
    blurred: boolean;
}
/** A range of UTF-16 code units in a text entry's value. */
export interface TextRange {
    /** The index of the range's first code unit. */
    start: number;
    /** The index one past the range's last code unit. */
    end: number;
}
/**
 * One hidden DOM `<input>` that receives typing for text the game draws
 * itself. The browser does the hard parts (keyboard layouts, IME
 * composition, clipboard, phone keyboards, screen readers); the entry
 * exposes the result as data.
 */
export interface TextEntry {
    /** The current text, as the DOM input holds it. */
    readonly value: string;
    /** The start of the selection, in UTF-16 code units. Equal to `selectionEnd` when it's just a caret. */
    readonly selectionStart: number;
    /** The end of the selection, in UTF-16 code units. */
    readonly selectionEnd: number;
    /** The IME composition range, or `null` when the player isn't composing. */
    readonly composition: TextRange | null;
    /** Whether the hidden input has focus, so the player's typing goes to it. */
    readonly isFocused: boolean;
    /** The hidden `<input>` element, for tests and for advanced integrations. */
    readonly element: HTMLInputElement;
    /**
     * Replaces the text, for clearing or prefilling it. The selection is
     * clamped to the new text. Doesn't count as a change in
     * {@link TextEntryEvents}, the same way setting a DOM input's value
     * doesn't raise `input`.
     * @param value - The new text.
     */
    setValue(value: string): void;
    /**
     * Selects a range of the text, or places the caret when `start` equals
     * `end`.
     * @param start - The selection's start, in UTF-16 code units.
     * @param end - The selection's end, in UTF-16 code units.
     */
    setSelection(start: number, end: number): void;
    /**
     * Places the hidden element over a rectangle, so phone keyboards scroll
     * it into view and IME candidate windows open next to it.
     * @param rect - The rectangle, in CSS pixels relative to the container.
     */
    setScreenRect(rect: CssRect): void;
    /**
     * Sets the element's HTML attributes. Fields left `undefined` are
     * removed.
     * @param attributes - The attributes to set.
     */
    setAttributes(attributes: TextEntryAttributes): void;
    /**
     * Focuses the hidden element. A phone only opens its keyboard when this
     * is called inside a user gesture's event handler (`pointerup`, `click`,
     * `touchend`).
     */
    focus(): void;
    /** Removes focus from the hidden element. */
    blur(): void;
    /**
     * Returns what happened since the last call, and clears it. Events
     * arrive from the DOM between ticks; draining them once per tick lets a
     * system react to each one exactly once.
     * @returns The events since the last call.
     */
    takeEvents(): TextEntryEvents;
    /** Removes the hidden element and its listeners. */
    dispose(): void;
}
/**
 * Creates a text entry: a hidden `<input>` appended to `container` that
 * receives the player's typing for text the game draws itself.
 *
 * It enforces the keyboard rules a game needs around a text box:
 * - A key that was already held when the input was focused (e.g. the Enter
 *   that opened the menu) doesn't auto-repeat into it.
 * - Enter and Escape are recorded as `submitted`/`cancelled` and have no
 *   browser behavior, except during an IME composition, where Enter
 *   commits the composition and Escape cancels it. Holding Enter submits
 *   once.
 * - Tab does nothing, since there's no tab order between game text fields.
 *
 * `KeyboardInputSource` ignores every key typed into an editable element,
 * so keys typed here never reach the game's input actions.
 *
 * If `container` isn't positioned, it's made `position: relative`, so the
 * element can be placed over a rectangle of it.
 * @param container - The element the game's canvas is in.
 * @returns The text entry.
 */
export declare function createTextEntry(container: HTMLElement): TextEntry;
