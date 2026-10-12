import { PositionEcsComponent } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
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
export declare const createUiCanvasGroupEcsSystem: () => EcsSystem<[RectTransformEcsComponent, PositionEcsComponent]>;
