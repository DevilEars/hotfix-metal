import { Color, } from '../../rendering/index.js';
import { textHorizontalAlignments } from '../../text/index.js';
import { addUiColorTransitionComponent, } from '../components/ui-color-transition-component.js';
import { addUiInteractableComponent, } from '../components/ui-interactable-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { uiAxisValue } from '../types/ui-axis.js';
import { createLabel } from './create-label.js';
import { createPanel } from './create-panel.js';
import { withDefaults } from '../../utilities/with-defaults.js';
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
export function createButton(world, parent, options) {
    // Built inside the function body (rather than as a shared module-level
    // default) since it references `Color.black`, and `rendering` and `ui`
    // participate in a load-time import cycle - resolving that reference
    // eagerly at this module's own top level can run before `rendering`'s
    // `Color` export exists yet. See `sprite-component.ts`'s
    // `defaultSpriteOptions` for the same pattern.
    const defaultCreateButtonOptions = {
        anchor: UiAnchor.center({ x: 200, y: 60 }),
        labelColor: Color.black,
    };
    const { anchor, anchoredPosition, labelMaxWidth, sprite, slices, label, fontAtlas, labelSize, labelColor, labelCategory, interactable: interactableOptions, transition: transitionOptions, } = withDefaults(defaultCreateButtonOptions, options);
    const entity = createPanel(world, parent, {
        anchor,
        anchoredPosition,
        sprite,
        slices,
    });
    const interactable = addUiInteractableComponent(world, entity, interactableOptions);
    addUiColorTransitionComponent(world, entity, transitionOptions);
    // `horizontalAlign: 'center'` re-centers each line within `maxWidth` (see
    // `createLabel`'s own doc comment). `UiAnchor.middleLeft` (a point
    // anchor) puts the label's own `x = 0` at the button's left edge, so
    // `maxWidth: uiAxisValue(anchor.x)` - already known statically here, since
    // a point axis's value is a literal size - is the button's actual width
    // with no per-frame resolved-rect lookup needed, unlike a stretch anchor.
    // Letting the engine recompute the label's position from
    // `maxWidth`/`horizontalAlign` - rather than pre-measuring the label's
    // shaped width once and baking in a fixed offset - keeps the label
    // centered even when its `text` changes later (e.g. `createDropdown`
    // swapping the header label to a different option), since
    // `createTextShapingEcsSystem` re-shapes on every text change.
    const labelEntity = createLabel(world, entity, {
        text: label,
        fontAtlas,
        size: labelSize,
        anchor: UiAnchor.middleLeft(),
        maxWidth: labelMaxWidth ?? uiAxisValue(anchor.x),
        horizontalAlign: textHorizontalAlignments.center,
        verticalAlign: 'middle',
        color: labelColor,
        category: labelCategory,
    });
    return {
        entity,
        label: labelEntity,
        interactable,
        onInvoke: interactable.onInvoke,
    };
}
