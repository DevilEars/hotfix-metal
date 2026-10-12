import { addPositionComponent } from '../../common/index.js';
import { addMaskComponent, addSpriteComponent, } from '../../rendering/index.js';
import { addRectTransformComponent } from '../components/rect-transform-component.js';
import { addUiColorTransitionComponent, } from '../components/ui-color-transition-component.js';
import { addUiInteractableComponent, } from '../components/ui-interactable-component.js';
import { addUiSliderComponent, normalizeUiSliderValue, } from '../components/ui-slider-component.js';
import { rectTransformId } from '../components/rect-transform-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { driveUiAxis, UiAxis } from '../types/ui-axis.js';
import { createPanel } from './create-panel.js';
import { driveUiFillMask } from './drive-ui-fill-mask.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * Creates a slider: a panel (see `createPanel`) used as the drag track, with
 * a `UiInteractableEcsComponent`, a `UiColorTransitionEcsComponent`, and a
 * `UiSliderEcsComponent` added, plus a child handle whose rect transform
 * `createUiSliderEcsSystem` drives from the slider's value every tick (and,
 * if `fillSprite` is given, a child fill covering the track, whose mask it
 * reveals up to the handle). The whole track is the drag
 * surface - clicking anywhere on it, not just the handle, jumps the handle
 * there.
 * @param world - The ECS world to create the slider entity in.
 * @param parent - The parent entity - a canvas (see `createUiCanvas`) or
 * another UI element.
 * @param options - Options for configuring the slider. `trackSprite` and
 * `handleSprite` have no sensible default and must always be provided.
 * @returns The created slider: its track entity, its child handle (and fill,
 * if any) entity, its `UiInteractableEcsComponent`, its
 * `UiSliderEcsComponent`, and `onValueChanged` for the common case of
 * registering a single listener.
 */
export function createSlider(world, parent, options) {
    const defaultCreateSliderOptions = {
        anchor: UiAnchor.center({ x: 300, y: 24 }),
        handleSize: { x: 24, y: 24 },
        minValue: 0,
        maxValue: 1,
        wholeNumbers: false,
    };
    const { anchor, anchoredPosition, trackSprite, slices, handleSprite, handleSize, fillSprite, minValue, maxValue, value, wholeNumbers, interactable: interactableOptions, transition: transitionOptions, } = withDefaults(defaultCreateSliderOptions, options);
    const entity = createPanel(world, parent, {
        anchor,
        anchoredPosition,
        sprite: trackSprite,
        slices,
    });
    const interactable = addUiInteractableComponent(world, entity, {
        dragThreshold: 0,
        receivesDrag: true,
        ...interactableOptions,
    });
    addUiColorTransitionComponent(world, entity, transitionOptions);
    let fill;
    if (fillSprite) {
        fill = world.createEntity();
        addPositionComponent(world, fill);
        world.setParent(fill, entity);
        addRectTransformComponent(world, fill, UiAnchor.stretchAll());
        addSpriteComponent(world, fill, {
            ...fillSprite,
        });
        // The layout system sizes the mask to the fill's rect, and
        // `createUiSliderEcsSystem` sets its amount from the slider's value.
        addMaskComponent(world, fill, {
            width: fillSprite.width,
            height: fillSprite.height,
            shape: { kind: 'linear', origin: 'left', amount: 0 },
        });
    }
    const handle = world.createEntity();
    addPositionComponent(world, handle);
    world.setParent(handle, entity);
    addRectTransformComponent(world, handle, {
        // `x.anchor` is driven to the slider's normalized value below and every
        // tick by `createUiSliderEcsSystem`, sliding the handle along the track.
        x: UiAxis.point(0, { pivot: 0.5, size: handleSize.x }),
        y: UiAxis.point(0.5, { size: handleSize.y }),
    });
    addSpriteComponent(world, handle, {
        ...handleSprite,
    });
    const slider = addUiSliderComponent(world, entity, {
        handle,
        fill,
        minValue,
        maxValue,
        value,
        wholeNumbers,
    });
    const t = normalizeUiSliderValue(slider);
    const handleRectTransform = world.getComponentRequired(handle, rectTransformId);
    driveUiAxis(handleRectTransform.x, t);
    if (fill !== undefined) {
        driveUiFillMask(world, fill, t, 'slider');
    }
    return {
        entity,
        handle,
        fill,
        interactable,
        slider,
        onValueChanged: slider.onValueChanged,
    };
}
