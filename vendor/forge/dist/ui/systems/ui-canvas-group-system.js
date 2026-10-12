import { positionId } from '../../common/index.js';
import { spriteId } from '../../rendering/index.js';
import { textId } from '../../text/index.js';
import { canvasGroupId, } from '../components/canvas-group-component.js';
import { rectTransformId, } from '../components/rect-transform-component.js';
const identityInheritedState = {
    alpha: 1,
    interactable: true,
    blocksRaycasts: true,
};
/** Combines `inherited` with `entity`'s own `CanvasGroupEcsComponent`, if it has one. */
function combineWithOwnGroup(world, entity, inherited) {
    const group = world.getComponent(entity, canvasGroupId);
    if (!group) {
        return inherited;
    }
    const base = group.ignoreParentGroups
        ? identityInheritedState
        : inherited.state;
    return {
        state: {
            alpha: base.alpha * group.alpha,
            interactable: base.interactable && group.interactable,
            blocksRaycasts: base.blocksRaycasts && group.blocksRaycasts,
        },
        isGoverned: true,
    };
}
/**
 * Creates a system that walks every `CanvasEcsComponent`'s rect hierarchy
 * top-down (the same hierarchy `createUiLayoutEcsSystem` walks), combining
 * each `CanvasGroupEcsComponent` it passes through with the ones above it,
 * and writes the resulting `alpha` into `SpriteEcsComponent.opacityMultiplier`/
 * `TextEcsComponent.opacityMultiplier` for every element under it - so
 * fading, disabling, or making click-through a whole panel is one
 * component instead of one per element. `interactable`/`blocksRaycasts`
 * are combined the same way but read on demand instead, via
 * `resolveCanvasGroupState` - see `createUiRaycastEcsSystem`/
 * `createUiInteractionEcsSystem`/`createUiNavigationEcsSystem`.
 *
 * An element with no `CanvasGroupEcsComponent` ancestor at all is left with
 * `opacityMultiplier` `undefined` (not `1`) so a plain sprite/text entity
 * with no ancestor canvas group is never touched.
 *
 * Must be registered after `createUiLayoutEcsSystem` (both walk the same
 * hierarchy; group state doesn't depend on resolved rects, but running
 * after keeps every UI system's relative order predictable) and before
 * `createRenderEcsSystem`.
 * @returns The UI canvas group ECS system.
 */
export const createUiCanvasGroupEcsSystem = () => ({
    name: 'uiCanvasGroup',
    query: [rectTransformId, positionId],
    update: (world, { entities }) => {
        const elements = new Set(entities);
        const visit = (entity, inherited) => {
            const combined = combineWithOwnGroup(world, entity, inherited);
            if (combined.isGoverned) {
                const sprite = world.getComponent(entity, spriteId);
                if (sprite) {
                    sprite.opacityMultiplier = combined.state.alpha;
                }
                const text = world.getComponent(entity, textId);
                if (text) {
                    text.opacityMultiplier = combined.state.alpha;
                }
            }
            for (const child of world.getChildren(entity)) {
                if (elements.has(child)) {
                    visit(child, combined);
                }
            }
        };
        const identityCombinedState = {
            state: identityInheritedState,
            isGoverned: false,
        };
        for (const entity of entities) {
            const parent = world.getParent(entity);
            if (parent === null || !elements.has(parent)) {
                visit(entity, identityCombinedState);
            }
        }
    },
});
