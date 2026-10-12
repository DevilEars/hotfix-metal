import { EcsWorld } from '../../ecs/ecs-world.js';
import { Color } from '../../rendering/index.js';
import { UiInteractionVisualState } from '../types/ui-interaction-visual-state.js';
/**
 * Fields of {@link UiColorTransitionEcsComponent} with a sensible default;
 * callers may omit these.
 */
export interface UiColorTransitionDefaultedOptions {
    /** Tint while `deriveUiInteractionVisualState` is `normal`. */
    normalColor: Color;
    /** Tint while `deriveUiInteractionVisualState` is `hover` (hovered or focused). */
    hoverColor: Color;
    /** Tint while `deriveUiInteractionVisualState` is `pressed`. */
    pressedColor: Color;
    /** Tint while `deriveUiInteractionVisualState` is `disabled`. */
    disabledColor: Color;
    /** How long, in milliseconds, a tint change takes to fully ease in. */
    duration: number;
    /**
     * The easing function driving the tint change, one of
     * `animations/easing-functions`. Defaults to `linear`.
     */
    easing: (t: number) => number;
}
export interface UiColorTransitionEcsComponent extends UiColorTransitionDefaultedOptions {
    /**
     * The visual state the current tween is easing towards. System-owned,
     * written by `createUiTransitionEcsSystem` when the derived visual state
     * changes; read-only to callers.
     */
    targetState: UiInteractionVisualState;
    /**
     * The tint the current tween started from. System-owned, written by
     * `createUiTransitionEcsSystem` whenever `targetState` changes (so a
     * mid-tween state change eases from the color actually on screen, not
     * from the previous target); read-only to callers.
     */
    fromColor: Color;
    /**
     * Milliseconds elapsed in the current tween. System-owned, written by
     * `createUiTransitionEcsSystem`; read-only to callers.
     */
    elapsedMilliseconds: number;
}
export declare const uiColorTransitionId: import("../../ecs/ecs-component.js").ComponentKey<UiColorTransitionEcsComponent>;
/**
 * Attaches a {@link UiColorTransitionEcsComponent} to `entity`. Needs a
 * `UiInteractableEcsComponent` (to derive the visual state from) and a
 * `SpriteEcsComponent` (whose `tintColor` `createUiTransitionEcsSystem`
 * eases) on the same entity.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the transition. Colors default
 * to `Color.white` (i.e. no tint change) for any state not given.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addUiColorTransitionComponent(world: EcsWorld, entity: number, options?: Partial<UiColorTransitionDefaultedOptions>): UiColorTransitionEcsComponent;
