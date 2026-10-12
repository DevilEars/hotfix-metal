import { visibilityId } from '../../rendering/index.js';
import { tooltipId, } from '../components/tooltip-component.js';
import { uiInteractableId, } from '../components/ui-interactable-component.js';
import { deriveUiInteractionVisualState, uiInteractionVisualStates, } from '../types/ui-interaction-visual-state.js';
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
export const createUiTooltipEcsSystem = (time) => ({
    name: 'uiTooltip',
    query: [tooltipId, uiInteractableId],
    update: (world, { components: [tooltips, interactables] }) => {
        for (let i = 0; i < tooltips.length; i++) {
            const tooltip = tooltips[i];
            const interactable = interactables[i];
            const visualState = deriveUiInteractionVisualState(interactable);
            const isActive = visualState === uiInteractionVisualStates.hover ||
                visualState === uiInteractionVisualStates.pressed;
            tooltip.hoverElapsedMilliseconds = isActive
                ? tooltip.hoverElapsedMilliseconds + time.deltaTimeInMilliseconds
                : 0;
            world.getComponentRequired(tooltip.panel, visibilityId).visible =
                isActive &&
                    tooltip.hoverElapsedMilliseconds >= tooltip.showDelayMilliseconds;
        }
    },
});
