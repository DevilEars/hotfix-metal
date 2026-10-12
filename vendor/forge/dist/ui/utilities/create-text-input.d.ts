import { EcsWorld } from '../../ecs/ecs-world.js';
import { ForgeEvent, ParameterizedForgeEvent } from '../../events/index.js';
import { Vector2 } from '../../math/index.js';
import { Color, NineSliceOptions, RenderContext, SpriteEcsComponent } from '../../rendering/index.js';
import type { FontAtlas } from '../../text/font-atlas/font-atlas.js';
import { TextInputAttributes, TextInputEcsComponent } from '../components/text-input-component.js';
import { UiColorTransitionDefaultedOptions } from '../components/ui-color-transition-component.js';
import { UiInteractableDefaultedOptions, UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
import { UiAnchorConfig } from '../types/ui-anchor.js';
/**
 * Fields of {@link CreateTextInputOptions} with no sensible default; callers
 * must always provide these.
 */
export interface CreateTextInputRequiredOptions {
    /**
     * The render context the field is drawn with. The field's hidden input
     * is added to its canvas's parent element (the game's container).
     */
    renderContext: RenderContext;
    /** The sprite to draw the field's background with, e.g. from `createImageSprite`. */
    sprite: SpriteEcsComponent;
    /**
     * A plain sprite (e.g. a white pixel) the caret, the selection highlight
     * and the IME composition underline are drawn with, tinted by
     * `caretColor` and `selectionColor`.
     */
    fillSprite: SpriteEcsComponent;
    /** The loaded font atlas the text is drawn from. Characters it has no glyph for can't be typed. */
    fontAtlas: FontAtlas;
    /** The text's font size, in reference pixels. */
    size: number;
}
/**
 * Fields of {@link CreateTextInputOptions} with a sensible default, or that
 * are genuinely optional; callers may omit these.
 */
export interface CreateTextInputDefaultedOptions {
    /**
     * The anchor to place the field with - see `UiAnchor` for common presets.
     * Defaults to `UiAnchor.center({ x: 400, y: 64 })`.
     */
    anchor: UiAnchorConfig;
    /** Offset of the field's pivot from its anchor reference point, in reference pixels. */
    anchoredPosition?: Vector2;
    /** Overrides `sprite.slices` for the background. */
    slices?: NineSliceOptions;
    /** Space between the field's left edge and its text, in reference pixels. Defaults to `16`. */
    padding: number;
    /** The field's initial text. Defaults to `''`. */
    value: string;
    /** The text shown while the field is empty. Defaults to `''`. */
    placeholder: string;
    /** The text's color. Defaults to `Color.black`. */
    textColor: Color;
    /** The placeholder's color. Defaults to a translucent gray. */
    placeholderColor: Color;
    /** The caret's and composition underline's color. Defaults to `Color.black`. */
    caretColor: Color;
    /** The selection highlight's color. Defaults to a translucent blue. */
    selectionColor: Color;
    /** The caret's width, in reference pixels. Defaults to `2`. */
    caretWidth: number;
    /**
     * The render category the text and placeholder draw with (see
     * `createLabel`'s `category`). Pass the value you gave the canvas's
     * `cullingMask`.
     */
    category?: number;
    /** See `TextInputDefaultedOptions.maxLength`. Defaults to no limit. */
    maxLength?: number;
    /** See `TextInputDefaultedOptions.filter`. */
    filter?: (text: string) => string;
    /** The hidden input's HTML attributes, e.g. `{ ariaLabel: 'Pilot name' }`. */
    attributes?: TextInputAttributes;
    /** Overrides for the field's `UiInteractableEcsComponent`. */
    interactable?: Partial<UiInteractableDefaultedOptions>;
    /** Overrides for the field's `UiColorTransitionEcsComponent` (its hover/pressed/disabled tints). */
    transition?: Partial<UiColorTransitionDefaultedOptions>;
}
export type CreateTextInputOptions = CreateTextInputRequiredOptions & Partial<CreateTextInputDefaultedOptions>;
/** The entities and components {@link createTextInput} created. */
export interface TextInput {
    /** The field's root entity: background panel, `UiInteractableEcsComponent` and `TextInputEcsComponent`. */
    entity: number;
    /** The field's `TextInputEcsComponent`, for reading `value` and `isEditing`. */
    textInput: TextInputEcsComponent;
    /** The field's `UiInteractableEcsComponent`. */
    interactable: UiInteractableEcsComponent;
    /** The label the value is drawn with. */
    textLabel: number;
    /** The label shown while the field is empty. */
    placeholderLabel: number;
    /** `textInput.onValueChanged`. */
    onValueChanged: ParameterizedForgeEvent<string>;
    /** `textInput.onSubmit`. */
    onSubmit: ParameterizedForgeEvent<string>;
    /** `textInput.onCancel`. */
    onCancel: ForgeEvent;
}
/**
 * Creates a single-line text field: a background panel (see `createPanel`)
 * with a `UiInteractableEcsComponent` (so it's hoverable, focusable and
 * reachable by navigation), a `UiColorTransitionEcsComponent` and a
 * `TextInputEcsComponent`, plus child entities for the selection
 * highlight, the text, the placeholder, the IME composition underline and
 * the caret. The player types into a hidden DOM input the field owns;
 * `createUiTextInputEcsSystem` (registered by `registerUiSystems`) does the
 * rest.
 *
 * The text sits `padding` from the field's left edge, its baseline placed
 * so the font's ascender-to-descender box is centered vertically. The field
 * doesn't scroll or clip, so choose a `maxLength` whose longest value fits
 * its width.
 * @param world - The ECS world to create the field in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the field. `renderContext`,
 * `sprite`, `fillSprite`, `fontAtlas` and `size` must always be provided.
 * @returns The created field.
 * @throws An error if the render context's canvas isn't in the document.
 */
export declare function createTextInput(world: EcsWorld, parent: number, options: CreateTextInputOptions): TextInput;
