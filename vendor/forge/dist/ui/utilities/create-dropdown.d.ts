import { EcsWorld } from '../../ecs/ecs-world.js';
import { ParameterizedForgeEvent } from '../../events/index.js';
import { Vector2 } from '../../math/index.js';
import { Color, NineSliceOptions, SpriteEcsComponent } from '../../rendering/index.js';
import type { FontAtlas } from '../../text/font-atlas/font-atlas.js';
import { UiColorTransitionDefaultedOptions } from '../components/ui-color-transition-component.js';
import { UiInteractableDefaultedOptions } from '../components/ui-interactable-component.js';
import { UiDropdownEcsComponent } from '../components/ui-dropdown-component.js';
import { UiAnchorConfig } from '../types/ui-anchor.js';
import { Button } from './create-button.js';
/**
 * Fields of {@link CreateDropdownOptions} with no sensible default; callers
 * must always provide these.
 */
export interface CreateDropdownRequiredOptions {
    /** The sprite to draw the header (the always-visible, currently-selected-option control) with. */
    headerSprite: SpriteEcsComponent;
    /** The sprite to draw each option row with. */
    optionSprite: SpriteEcsComponent;
    /** The dropdown's option labels, in display order. Must be non-empty. */
    options: readonly string[];
    /** The loaded font atlas the header and option labels are drawn from. */
    fontAtlas: FontAtlas;
}
/**
 * Fields of {@link CreateDropdownOptions} with a sensible default; callers
 * may omit these.
 */
export interface CreateDropdownDefaultedOptions {
    /**
     * The anchor to place the header with - see `UiAnchor` for common
     * presets (e.g. `UiAnchor.topLeft({ x: 240, y: 56 })`). Defaults to
     * `UiAnchor.topLeft({ x: 240, y: 56 })`.
     */
    anchor: UiAnchorConfig;
    /** Offset of the header's pivot from its anchor reference point, in reference pixels. */
    anchoredPosition?: Vector2;
    /** Overrides `headerSprite.slices`/`optionSprite.slices`. */
    slices?: NineSliceOptions;
    /** The index into `options` initially selected. Defaults to `0`. */
    selectedIndex: number;
    /** The header's and each option's label font size, in reference pixels. Defaults to `24`. */
    labelSize: number;
    /** The header's and each option's label tint. Defaults to `Color.black`. */
    labelColor: Color;
    /**
     * The render category the header's and each option's label text draws
     * with, forwarded to `createLabel`'s `category` option - see
     * `CreateButtonDefaultedOptions.labelCategory` for why there's no shared
     * default to fall back on.
     */
    labelCategory?: number;
    /** Each option row's height, in reference pixels. Defaults to the header's own height. */
    optionHeight?: number;
    /**
     * Overrides for the header's `UiInteractableEcsComponent` (e.g. to start
     * it non-`interactable`). Also applied to every option row.
     */
    interactable?: Partial<UiInteractableDefaultedOptions>;
    /**
     * Overrides for the header's and each option row's
     * `UiColorTransitionEcsComponent`.
     */
    transition?: Partial<UiColorTransitionDefaultedOptions>;
}
export type CreateDropdownOptions = CreateDropdownRequiredOptions & Partial<CreateDropdownDefaultedOptions>;
export interface Dropdown {
    /** The dropdown's root entity - the header - a `createButton` result's entity, also carrying the `UiDropdownEcsComponent`. */
    entity: number;
    /** The header button, showing the currently selected option's label. Clicking it toggles `isOpen`. */
    header: Button;
    /**
     * The option list's container entity, parented to the header and
     * covering the same rect. Its `VisibilityEcsComponent` hides the whole
     * list (drawn, hit-tested and focusable as nothing) while closed.
     */
    list: number;
    /**
     * The option row buttons, in `options` order, parented to `list`.
     * Clicking one selects it and closes the list.
     */
    options: Button[];
    /**
     * The chevron label entity, parented to the header - shows `v` while
     * closed and `^` while open (see `chevronClosedText`/`chevronOpenText`;
     * the bundled default font atlas is ASCII-only, so these stand in for a
     * down/up-pointing triangle).
     */
    chevron: number;
    /** The dropdown's `UiDropdownEcsComponent`, for reading `isOpen`/`selectedIndex` directly. */
    dropdown: UiDropdownEcsComponent;
    /**
     * Raised whenever an option is selected - `dropdown.onValueChanged`,
     * surfaced directly since registering a single listener on it is the
     * overwhelmingly common case.
     */
    onValueChanged: ParameterizedForgeEvent<number>;
}
/**
 * Creates a dropdown: a header button (see `createButton`) showing the
 * currently selected option and a chevron indicator on its right edge, with
 * a `UiDropdownEcsComponent` added, plus one option-row button per entry in
 * `options`, stacked below the header in a `list` container that's hidden
 * (see `VisibilityEcsComponent`) until the header is clicked open. Selecting an option updates the header's label, raises
 * `onValueChanged`, and closes the list. The chevron flips between
 * `chevronClosedText` and `chevronOpenText` in step with `dropdown.isOpen`.
 *
 * **Known limitation**: clicking outside the open list doesn't close it -
 * only clicking the header again or selecting an option does. Register your
 * own listener (e.g. on a full-canvas click-catcher, gated on
 * `dropdown.isOpen`) if your game needs that.
 * @param world - The ECS world to create the dropdown entity in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the dropdown. `headerSprite`,
 * `optionSprite`, `options`, and `fontAtlas` have no sensible default and
 * must always be provided.
 * @returns The created dropdown: its header entity/button, its option row
 * buttons and their list container, its chevron label entity, its `UiDropdownEcsComponent`, and
 * `onValueChanged` for the common case of registering a single listener.
 */
export declare function createDropdown(world: EcsWorld, parent: number, options: CreateDropdownOptions): Dropdown;
