import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/index.js';
import { Color, SpriteEcsComponent } from '../../rendering/index.js';
import type { FontAtlas } from '../../text/font-atlas/font-atlas.js';
/**
 * Fields of {@link CreateTooltipOptions} with no sensible default; callers
 * must always provide these.
 */
export interface CreateTooltipRequiredOptions {
    /** The tooltip's text. */
    text: string;
    /** The loaded font atlas the text is drawn from. */
    fontAtlas: FontAtlas;
    /** The text's font size, in reference pixels. */
    textSize: number;
    /** The sprite to draw the tooltip's background panel with, e.g. from `createImageSprite`. */
    sprite: SpriteEcsComponent;
}
/**
 * Fields of {@link CreateTooltipOptions} with a sensible default; callers
 * may omit these.
 */
export interface CreateTooltipDefaultedOptions {
    /** The tooltip panel's size, in reference pixels. Defaults to `{ x: 160, y: 40 }`. */
    size: Vector2;
    /**
     * Gap between the source element's top edge and the tooltip's bottom
     * edge, in reference pixels. Defaults to `{ x: 0, y: 8 }` - a small
     * vertical gap, horizontally centered over the source.
     */
    offset: Vector2;
    /** How long, in milliseconds, the source must stay hovered/focused before the tooltip appears. Defaults to `400`. */
    showDelayMilliseconds: number;
    /** The text's tint. Defaults to `Color.white`. */
    textColor: Color;
    /**
     * The render category the tooltip's label text draws with, forwarded to
     * `createLabel`'s `category` option - the panel's own category comes
     * from `sprite.category` instead, unaffected by this. Pass
     * the same value you gave the tooltip's canvas's `cullingMask` (see
     * `ScreenSpaceUiCanvasOptions.cullingMask`) so the label is actually
     * visible through it. Omitted, the label falls back to `TextEcsComponent`'s
     * own default (`TEXT_RENDER_CATEGORY`).
     */
    category?: number;
}
export type CreateTooltipOptions = CreateTooltipRequiredOptions & Partial<CreateTooltipDefaultedOptions>;
export interface Tooltip {
    /** The tooltip panel's entity - a `RectTransformEcsComponent` + `SpriteEcsComponent`, parented to `source`. */
    panel: number;
    /** The tooltip's child label entity - see `createLabel`. */
    label: number;
}
/**
 * Attaches a tooltip to `source` - an already-interactable entity (it must
 * already carry a `UiInteractableEcsComponent`, e.g. from `createButton` or
 * `addUiInteractableComponent`) - and a `TooltipEcsComponent` driving it.
 *
 * The tooltip panel is parented directly to `source` with an anchor pinned
 * to its top edge, pivoted at the panel's own bottom edge, so it floats
 * just above `source` and follows it automatically as an ordinary UI child
 * - `createUiTooltipEcsSystem` only ever toggles it visible/hidden, never
 * repositions it. The panel starts hidden by its `VisibilityEcsComponent`,
 * which hides the label parented under it too; `createUiTooltipEcsSystem`
 * shows them once `source`
 * has been continuously hovered or focused for `showDelayMilliseconds`.
 *
 * The panel is drawn in hierarchy order, right after `source`'s other
 * children, so elements that come after `source` in hierarchy order (its
 * later siblings, for example) draw over it. To draw the tooltip above
 * them, add a `DrawOrderEcsComponent` with a positive `order` to `panel`.
 * @param world - The ECS world `source` belongs to.
 * @param source - The interactable entity the tooltip appears near. Must
 * already have a `UiInteractableEcsComponent`.
 * @param options - Options for configuring the tooltip. `text`,
 * `fontAtlas`, `textSize`, and `sprite` have no sensible default and must
 * always be provided.
 * @throws An error if `source` has no `UiInteractableEcsComponent`.
 * @returns The created tooltip's panel and label entities.
 */
export declare function createTooltip(world: EcsWorld, source: number, options: CreateTooltipOptions): Tooltip;
