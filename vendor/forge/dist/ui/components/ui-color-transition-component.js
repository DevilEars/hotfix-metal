import { createComponentId } from '../../ecs/ecs-component.js';
import { linear } from '../../animations/easing-functions/index.js';
import { Color } from '../../rendering/index.js';
import { uiInteractionVisualStates, } from '../types/ui-interaction-visual-state.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const uiColorTransitionId = createComponentId('uiColorTransition');
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
export function addUiColorTransitionComponent(world, entity, options = {}) {
    // Built inside the function body (rather than as a shared module-level
    // default) since it references `Color.white`, and `rendering` and `ui`
    // participate in a load-time import cycle - resolving that reference
    // eagerly at this module's own top level can run before `rendering`'s
    // `Color` export exists yet. See `sprite-component.ts`'s
    // `defaultSpriteOptions` for the same pattern.
    const defaultUiColorTransitionOptions = {
        normalColor: Color.white,
        hoverColor: Color.white,
        pressedColor: Color.white,
        disabledColor: Color.white,
        duration: 100,
        easing: linear,
    };
    const merged = withDefaults(defaultUiColorTransitionOptions, options);
    const component = {
        ...merged,
        targetState: uiInteractionVisualStates.normal,
        fromColor: merged.normalColor,
        elapsedMilliseconds: merged.duration,
    };
    return world.addComponent(entity, uiColorTransitionId, component);
}
