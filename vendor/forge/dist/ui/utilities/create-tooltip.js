import { addVisibilityComponent, Color, } from '../../rendering/index.js';
import { textHorizontalAlignments, textVerticalAlignments, } from '../../text/index.js';
import { addTooltipComponent } from '../components/tooltip-component.js';
import { uiInteractableId } from '../components/ui-interactable-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { UiAxis } from '../types/ui-axis.js';
import { createLabel } from './create-label.js';
import { createPanel } from './create-panel.js';
import { withDefaults } from '../../utilities/with-defaults.js';
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
export function createTooltip(world, source, options) {
    const defaultCreateTooltipOptions = {
        size: { x: 160, y: 40 },
        offset: { x: 0, y: 8 },
        showDelayMilliseconds: 400,
        textColor: Color.white,
    };
    const { text, fontAtlas, textSize, sprite, size, offset, showDelayMilliseconds, textColor, category, } = withDefaults(defaultCreateTooltipOptions, options);
    if (!world.getComponent(source, uiInteractableId)) {
        throw new Error("createTooltip requires `source` to already have a UiInteractableEcsComponent (e.g. from createButton or addUiInteractableComponent) - a tooltip is shown/hidden based on that component's hover/focus state.");
    }
    const panel = createPanel(world, source, {
        sprite,
        anchor: {
            x: UiAxis.point(0.5, { size: size.x }),
            y: UiAxis.point(1, { pivot: 0, size: size.y }),
        },
        anchoredPosition: offset,
    });
    const label = createLabel(world, panel, {
        text,
        fontAtlas,
        size: textSize,
        anchor: UiAnchor.stretchAll(),
        horizontalAlign: textHorizontalAlignments.center,
        verticalAlign: textVerticalAlignments.middle,
        color: textColor,
        category,
    });
    addVisibilityComponent(world, panel, { visible: false });
    addTooltipComponent(world, source, {
        panel,
        showDelayMilliseconds,
    });
    return { panel, label };
}
