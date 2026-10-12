import { EcsSystem } from '../../ecs/ecs-system.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
/**
 * Creates a system that arranges every `UiAxisLayoutGroupEcsComponent`/
 * `GridLayoutGroupEcsComponent`'s direct children, and resizes every `ContentSizeFitterEcsComponent`'s own entity
 * to its measured content size - both against `RectTransformEcsComponent.rect`
 * as it stood at the *end of the previous frame*, since this system must run
 * before `createUiLayoutEcsSystem` (the one that resolves `rect` for this
 * frame) so the size/`anchoredPosition` it writes are resolved into
 * an up-to-date rect the same tick. This means a group whose own size just
 * changed (a fresh entity, a `ContentSizeFitterEcsComponent` reacting to a
 * child that changed size, a group nested inside another) arranges its
 * children against a one-frame-stale box; like the rest of this module's
 * full-recompute-every-frame approach (see `createUiLayoutEcsSystem`'s own
 * doc comment), this converges within a frame or two rather than being
 * tracked with dirty state.
 *
 * Must be registered before `createUiLayoutEcsSystem`.
 * @returns The UI layout group ECS system.
 */
export declare const createUiLayoutGroupEcsSystem: () => EcsSystem<[RectTransformEcsComponent]>;
