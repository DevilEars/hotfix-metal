const enterCode = 'Enter';
const escapeCode = 'Escape';
const tabCode = 'Tab';
/** The `keyCode` browsers report for a key event that's part of an IME composition. */
const imeProcessKeyCode = 229;
const attributeNames = {
    ariaLabel: 'aria-label',
    inputMode: 'inputmode',
    autocomplete: 'autocomplete',
    autocapitalize: 'autocapitalize',
    enterKeyHint: 'enterkeyhint',
    maxLength: 'maxlength',
};
function createNoEvents() {
    return {
        changed: false,
        submitted: false,
        cancelled: false,
        blurred: false,
    };
}
function toAttributeValue(key, value) {
    if (value === undefined) {
        return null;
    }
    if (key === 'maxLength') {
        return Number.isFinite(value)
            ? String(Math.max(0, Math.floor(Number(value))))
            : null;
    }
    return String(value);
}
function createHiddenInput() {
    const element = document.createElement('input');
    element.type = 'text';
    element.spellcheck = false;
    // Invisible but still focusable and still laid out over the field: a
    // phone scrolls a focused input into view above its keyboard, and an IME
    // opens its candidate window next to it, so it has to be where the field
    // is. `opacity: 0` also hides the browser's own caret and selection
    // highlight, which the game draws itself. `pointer-events: none` lets
    // taps through to the game's own hit test. A 16px font stops iOS from
    // zooming the page when the input is focused.
    Object.assign(element.style, {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '1px',
        height: '1px',
        margin: '0',
        padding: '0',
        border: '0',
        outline: 'none',
        boxSizing: 'border-box',
        background: 'transparent',
        color: 'transparent',
        caretColor: 'transparent',
        fontSize: '16px',
        opacity: '0',
        pointerEvents: 'none',
    });
    return element;
}
function isComposingKey(event) {
    // `keyCode` is deprecated, but it's the only way to recognize the
    // keydown that some browsers send just before `compositionstart`.
    // eslint-disable-next-line sonarjs/deprecation
    return event.isComposing || event.keyCode === imeProcessKeyCode;
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
export function createTextEntry(container) {
    const element = createHiddenInput();
    const keysPressedWhileFocused = new Set();
    const attributes = new Map();
    let lastRect = null;
    let events = createNoEvents();
    let isFocused = false;
    let composition = null;
    if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }
    const onKeyDown = (event) => {
        if (event.repeat && !keysPressedWhileFocused.has(event.code)) {
            event.preventDefault();
            return;
        }
        keysPressedWhileFocused.add(event.code);
        if (isComposingKey(event)) {
            return;
        }
        if (event.code === enterCode || event.key === enterCode) {
            event.preventDefault();
            events.submitted ||= !event.repeat;
            return;
        }
        if (event.code === escapeCode || event.key === escapeCode) {
            event.preventDefault();
            events.cancelled ||= !event.repeat;
            return;
        }
        if (event.code === tabCode || event.key === tabCode) {
            event.preventDefault();
        }
    };
    const onKeyUp = (event) => {
        keysPressedWhileFocused.delete(event.code);
    };
    const onInput = () => {
        events.changed = true;
    };
    const onCompositionStart = () => {
        const start = element.selectionStart ?? element.value.length;
        composition = { start, end: start };
    };
    const onCompositionUpdate = (event) => {
        if (composition === null) {
            onCompositionStart();
        }
        if (composition !== null) {
            composition = {
                start: composition.start,
                end: composition.start + event.data.length,
            };
        }
    };
    const onCompositionEnd = () => {
        composition = null;
        events.changed = true;
    };
    const onFocus = () => {
        isFocused = true;
        keysPressedWhileFocused.clear();
    };
    const onBlur = () => {
        isFocused = false;
        composition = null;
        keysPressedWhileFocused.clear();
        events.blurred = true;
    };
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    element.addEventListener('input', onInput);
    element.addEventListener('compositionstart', onCompositionStart);
    element.addEventListener('compositionupdate', onCompositionUpdate);
    element.addEventListener('compositionend', onCompositionEnd);
    element.addEventListener('focus', onFocus);
    element.addEventListener('blur', onBlur);
    container.appendChild(element);
    return {
        get value() {
            return element.value;
        },
        get selectionStart() {
            return element.selectionStart ?? element.value.length;
        },
        get selectionEnd() {
            return element.selectionEnd ?? element.value.length;
        },
        get composition() {
            return composition;
        },
        get isFocused() {
            return isFocused;
        },
        element,
        setValue(value) {
            if (element.value === value) {
                return;
            }
            const start = element.selectionStart ?? value.length;
            const end = element.selectionEnd ?? value.length;
            element.value = value;
            element.setSelectionRange(Math.min(start, value.length), Math.min(end, value.length));
        },
        setSelection(start, end) {
            element.setSelectionRange(start, end);
        },
        setScreenRect(rect) {
            if (lastRect &&
                lastRect.left === rect.left &&
                lastRect.top === rect.top &&
                lastRect.width === rect.width &&
                lastRect.height === rect.height) {
                return;
            }
            lastRect = { ...rect };
            element.style.left = `${rect.left}px`;
            element.style.top = `${rect.top}px`;
            element.style.width = `${rect.width}px`;
            element.style.height = `${rect.height}px`;
        },
        setAttributes(newAttributes) {
            for (const key of Object.keys(attributeNames)) {
                const name = attributeNames[key];
                const value = toAttributeValue(key, newAttributes[key]);
                if ((attributes.get(name) ?? null) === value) {
                    continue;
                }
                if (value === null) {
                    attributes.delete(name);
                    element.removeAttribute(name);
                    continue;
                }
                attributes.set(name, value);
                element.setAttribute(name, value);
            }
        },
        focus() {
            element.focus({ preventScroll: true });
        },
        blur() {
            element.blur();
        },
        takeEvents() {
            const taken = events;
            events = createNoEvents();
            return taken;
        },
        dispose() {
            element.removeEventListener('keydown', onKeyDown);
            element.removeEventListener('keyup', onKeyUp);
            element.removeEventListener('input', onInput);
            element.removeEventListener('compositionstart', onCompositionStart);
            element.removeEventListener('compositionupdate', onCompositionUpdate);
            element.removeEventListener('compositionend', onCompositionEnd);
            element.removeEventListener('focus', onFocus);
            element.removeEventListener('blur', onBlur);
            element.remove();
        },
    };
}
