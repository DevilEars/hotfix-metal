import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/index.js';
import { NineSliceOptions, SpriteEcsComponent } from '../../rendering/index.js';
import { UiAnchorConfig } from '../types/ui-anchor.js';
/**
 * Fields of {@link CreatePanelOptions} with no sensible default; callers
 * must always provide these.
 */
export interface CreatePanelRequiredOptions {
    /**
     * The sprite to draw the panel with, e.g. from `createImageSprite`. Copied
     * rather than attached directly, so the same `sprite` can be passed to
     * multiple `createPanel` calls without one panel's layout-driven
     * `width`/`height`/`pivot` mutations affecting another's.
     */
    sprite: SpriteEcsComponent;
}
/**
 * Fields of {@link CreatePanelOptions} with a sensible default; callers may
 * omit these.
 */
export interface CreatePanelDefaultedOptions {
    /**
     * The anchor to place the panel with - see `UiAnchor` for common
     * presets (e.g. `UiAnchor.center({ x: 200, y: 60 })`), each of which
     * bakes in the literal size/margin its own axes actually take. Defaults
     * to `UiAnchor.center()`.
     */
    anchor: UiAnchorConfig;
    /** Offset of the panel's pivot from its anchor reference point, in reference pixels. */
    anchoredPosition?: Vector2;
    /**
     * Overrides `sprite.slices` for this panel, for reusing one base sprite
     * with different nine-slice configuration across panels. An omitted
     * `nativeWidth`/`nativeHeight` is taken from `sprite`'s own
     * `width`/`height` (its imported size), not from the panel's laid-out
     * size, so the insets should be in the same units as that imported size
     * (reference pixels for a sprite imported with `pixelsPerUnit: 1`).
     */
    slices?: NineSliceOptions;
}
export type CreatePanelOptions = CreatePanelRequiredOptions & Partial<CreatePanelDefaultedOptions>;
/**
 * Creates a UI panel: an entity with a `RectTransformEcsComponent` (parented
 * to `parent`) and a `SpriteEcsComponent`. `createUiLayoutEcsSystem` drives
 * the sprite's `width`/`height`/`pivot` from the resolved rect
 * every frame - the panel always exactly fills its rect.
 * @param world - The ECS world to create the panel entity in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the panel. `sprite` has no
 * sensible default and must always be provided.
 * @returns The created panel entity.
 */
export declare function createPanel(world: EcsWorld, parent: number, options: CreatePanelOptions): number;
