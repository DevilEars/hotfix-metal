import { EcsSystem } from '../../ecs/ecs-system.js';
import { AspectRatioFitterEcsComponent } from '../components/aspect-ratio-fitter-component.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
/**
 * Creates a system that keeps every `AspectRatioFitterEcsComponent`'s
 * `RectTransformEcsComponent`'s own size at its configured `aspectRatio` -
 * `widthControlsHeight`/`heightControlsWidth` derive one axis from the
 * other; `fitInParent`/`envelopeParent` derive both axes from the parent's
 * own resolved `rect` (one frame stale, like every other cross-entity read
 * in this module - see `createUiLayoutEcsSystem`'s own doc comment), and
 * are a no-op for an entity with no parent.
 *
 * Must be registered before `createUiLayoutEcsSystem`.
 * @returns The UI aspect ratio fitter ECS system.
 */
export declare const createUiAspectRatioFitterEcsSystem: () => EcsSystem<[AspectRatioFitterEcsComponent, RectTransformEcsComponent]>;
