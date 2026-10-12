import { EcsWorld } from '../../ecs/ecs-world.js';
import { ForgeEvent } from '../../events/index.js';
import { Vector2 } from '../../math/index.js';
import { Color, NineSliceOptions, SpriteEcsComponent } from '../../rendering/index.js';
import type { FontAtlas } from '../../text/font-atlas/font-atlas.js';
import { UiColorTransitionDefaultedOptions } from '../components/ui-color-transition-component.js';
import { UiInteractableDefaultedOptions, UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
import { UiAnchorConfig } from '../types/ui-anchor.js';
/**
 * Fields of {@link CreateButtonOptions} with no sensible default; callers
 * must always provide these.
 */
export interface CreateButtonRequiredOptions {
    /**
     * The sprite to draw the button's background with, e.g. from
     * `createImageSprite` - see `createPanel`'s `sprite` option, which this
     * is passed straight through to.
     */
    sprite: SpriteEcsComponent;
    /** The button's label text. */
    label: string;
    /** The loaded font atlas the label is drawn from. */
    fontAtlas: FontAtlas;
    /** The label's font size, in reference pixels. */
    labelSize: number;
}
/**
 * Fields of {@link CreateButtonOptions} with a sensible default, or that are
 * genuinely optional (no default at all); callers may omit these.
 */
export interface CreateButtonDefaultedOptions {
    /**
     * The anchor to place the button with - see `UiAnchor` for common
     * presets (e.g. `UiAnchor.center({ x: 200, y: 60 })`). Defaults to
     * `UiAnchor.center({ x: 200, y: 60 })`.
     */
    anchor: UiAnchorConfig;
    /** Offset of the button's pivot from its anchor reference point, in reference pixels. */
    anchoredPosition?: Vector2;
    /**
     * The width the label centers within, in reference pixels. Defaults to
     * `anchor.x`'s own size/margin value, which is only the button's actual
     * rendered width when `anchor.x` is point-anchored - pass this explicitly
     * when it's stretch-anchored instead, where that value is a margin rather
     * than a width and can't be used to derive it (see `createDropdown`'s
     * option rows, which stretch to the header's width and pass that through
     * here).
     */
    labelMaxWidth?: number;
    /** Overrides `sprite.slices` for this button. */
    slices?: NineSliceOptions;
    /** The label's tint. Defaults to `Color.black`. */
    labelColor: Color;
    /**
     * The render category the label's text draws with, forwarded to
     * `createLabel`'s `category` option - omitted, the label falls back to
     * `TextEcsComponent`'s own default (`TEXT_RENDER_CATEGORY`), same as any
     * other label. Pass the same value you gave the button's canvas's
     * `cullingMask` (see `ScreenSpaceUiCanvasOptions.cullingMask`) so the
     * label is actually visible through it.
     */
    labelCategory?: number;
    /**
     * Overrides for the button's `UiInteractableEcsComponent` (e.g. to start
     * it non-`interactable`, or to disable `blocksRaycasts`).
     */
    interactable?: Partial<UiInteractableDefaultedOptions>;
    /**
     * Overrides for the button's `UiColorTransitionEcsComponent` (its
     * hover/pressed/disabled tints, transition duration, and easing).
     */
    transition?: Partial<UiColorTransitionDefaultedOptions>;
}
export type CreateButtonOptions = CreateButtonRequiredOptions & Partial<CreateButtonDefaultedOptions>;
export interface Button {
    /** The button's root entity - a `RectTransformEcsComponent` + `SpriteEcsComponent` + `UiInteractableEcsComponent` + `UiColorTransitionEcsComponent`. */
    entity: number;
    /** The child label entity - see `createLabel`. */
    label: number;
    /** The button's `UiInteractableEcsComponent`, for reading interaction state (`isHovered`, `isPressed`, ...) or registering pointer-event listeners beyond `onInvoke`. */
    interactable: UiInteractableEcsComponent;
    /**
     * Raised when the button is invoked, by a pointer click or a submit
     * action - `interactable.onInvoke`, surfaced directly since registering a
     * single listener on it is the overwhelmingly common case.
     */
    onInvoke: ForgeEvent;
}
/**
 * Creates a button: a panel (see `createPanel`) with a
 * `UiInteractableEcsComponent` and a `UiColorTransitionEcsComponent` added,
 * plus a centered child label (see `createLabel`). There is no
 * `ButtonEcsComponent` - a button is fully described by those three parts,
 * each of which is independently useful and can be dropped or replaced by
 * building the same pieces by hand instead of calling this.
 * @param world - The ECS world to create the button entity in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the button. `sprite`, `label`,
 * `fontAtlas`, and `labelSize` have no sensible default and must always be
 * provided.
 * @returns The created button: its entity, its child label entity, its
 * `UiInteractableEcsComponent`, and `onInvoke` for the common case of
 * registering a single listener.
 */
export declare function createButton(world: EcsWorld, parent: number, options: CreateButtonOptions): Button;
