import { createComponentId } from '../../ecs/ecs-component.js';
import { Vec2 } from '../../math/index.js';
import { uiCanvasRenderModes } from '../types/ui-canvas-render-mode.js';
import { uiScaleModes } from '../types/ui-scale-mode.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const canvasId = createComponentId('canvas');
const defaultScreenSpaceCanvasFields = {
    referenceResolution: { x: 1920, y: 1080 },
    scaleMode: uiScaleModes.scaleWithScreenSize,
};
/**
 * Attaches a {@link CanvasEcsComponent} to `entity`. A canvas also needs a
 * `RectTransformEcsComponent` and a `PositionEcsComponent` - for
 * `renderMode: 'screenSpace'` (the default), the rect is resolved every
 * frame from `referenceResolution`/`scaleMode` rather than a parent; for
 * `'worldSpace'`, it's an ordinary rect positioned via the entity hierarchy
 * like any other UI element. Use `createUiCanvas` to get a fully wired
 * canvas entity - including its camera for `'screenSpace'` mode - in one
 * call.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the canvas. `camera` has no
 * sensible default and must always be provided; which of the other fields
 * are available depends on `renderMode` (see {@link ScreenSpaceCanvasFields}
 * / {@link WorldSpaceCanvasFields}).
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addCanvasComponent(world, entity, options) {
    const runtimeState = {
        isPointerOverUi: false,
        hoveredEntity: null,
        focusedEntity: null,
    };
    const component = options.renderMode === uiCanvasRenderModes.worldSpace
        ? { ...options, ...runtimeState }
        : {
            ...withDefaults(defaultScreenSpaceCanvasFields, options),
            renderMode: uiCanvasRenderModes.screenSpace,
            ...runtimeState,
        };
    if (component.renderMode === uiCanvasRenderModes.screenSpace) {
        // `defaultScreenSpaceCanvasFields.referenceResolution` is a single,
        // shared module-level `Vector2` - cloning it here keeps one canvas's
        // later in-place mutation of its own `referenceResolution` from
        // corrupting every other canvas that was created with the same default,
        // the same reasoning `rect-transform-component.ts` documents for `x`/`y`.
        component.referenceResolution = Vec2.clone(component.referenceResolution);
    }
    return world.addComponent(entity, canvasId, component);
}
