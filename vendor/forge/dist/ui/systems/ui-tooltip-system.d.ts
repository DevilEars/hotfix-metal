import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { TooltipEcsComponent } from '../components/tooltip-component.js';
import { UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
/**
 * Creates a system that shows/hides a `TooltipEcsComponent`'s `panel`, and
 * everything parented under it, through the panel's
 * `VisibilityEcsComponent`, based on the source entity's own `UiInteractableEcsComponent` state:
 * visible while `deriveUiInteractionVisualState` reads `hover` or `pressed`
 * (pointer-hovered, gamepad/keyboard-focused, or mid-press - source-agnostic,
 * like the rest of this module) *and* that state has held continuously for
 * at least `showDelayMilliseconds`; hidden immediately otherwise.
 *
 * Positioning is deliberately not this system's job - `createTooltip`
 * parents the tooltip to the source entity with an ordinary anchored
 * `RectTransformEcsComponent`, so `createUiLayoutEcsSystem` resolves its
 * position every frame exactly like any other UI child, following the
 * source (and reflecting layout changes to it) with no extra code here.
 *
 * Must be registered after `createUiInteractionEcsSystem` and
 * `createUiNavigationEcsSystem` (it reads the interaction state they
 * write) and before `createRenderEcsSystem`.
 * @param time - The time instance driving `hoverElapsedMilliseconds`.
 * @returns The UI tooltip ECS system.
 * @throws From `update`: an error if a tooltip's `panel` has no
 * `VisibilityEcsComponent`.
 */
export declare const createUiTooltipEcsSystem: (time: Time) => EcsSystem<[TooltipEcsComponent, UiInteractableEcsComponent]>;
