import { addPositionComponent } from '../../common/index.js';
import { addMaskComponent, addSpriteComponent, } from '../../rendering/index.js';
import { addRectTransformComponent } from '../components/rect-transform-component.js';
import { addUiProgressBarComponent, normalizeUiProgressBarValue, } from '../components/ui-progress-bar-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { createPanel } from './create-panel.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * Creates a progress bar: a panel (see `createPanel`) used as the
 * background/track, plus a child fill covering it, revealed by a
 * `MaskEcsComponent` whose amount `createUiProgressBarEcsSystem` sets from
 * `value` every tick. Children added to the fill (a label) are revealed
 * with it. Purely
 * visual - unlike `createSlider`, no `UiInteractableEcsComponent` is added,
 * since a progress bar reports state rather than accepting input.
 * @param world - The ECS world to create the progress bar entity in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the progress bar. `trackSprite`
 * and `fillSprite` have no sensible default and must always be provided.
 * @returns The created progress bar: its track entity, its child fill
 * entity, and its `UiProgressBarEcsComponent`.
 */
export function createProgressBar(world, parent, options) {
    const defaultCreateProgressBarOptions = {
        anchor: UiAnchor.center({ x: 300, y: 24 }),
        minValue: 0,
        maxValue: 1,
        fillShape: { kind: 'linear', origin: 'left' },
    };
    const { anchor, anchoredPosition, trackSprite, slices, fillSprite, minValue, maxValue, value, fillShape, } = withDefaults(defaultCreateProgressBarOptions, options);
    const entity = createPanel(world, parent, {
        anchor,
        anchoredPosition,
        sprite: trackSprite,
        slices,
    });
    const fill = world.createEntity();
    addPositionComponent(world, fill);
    world.setParent(fill, entity);
    addRectTransformComponent(world, fill, UiAnchor.stretchAll());
    addSpriteComponent(world, fill, {
        ...fillSprite,
    });
    const progressBar = addUiProgressBarComponent(world, entity, {
        fill,
        minValue,
        maxValue,
        value,
    });
    // The layout system sizes the mask to the fill's rect.
    addMaskComponent(world, fill, {
        width: fillSprite.width,
        height: fillSprite.height,
        shape: { ...fillShape, amount: normalizeUiProgressBarValue(progressBar) },
    });
    return { entity, fill, progressBar };
}
