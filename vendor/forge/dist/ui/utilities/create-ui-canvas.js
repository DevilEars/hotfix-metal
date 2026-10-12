import { addPositionComponent } from '../../common/index.js';
import { Color, createCamera, createRenderTarget, } from '../../rendering/index.js';
import { addCanvasComponent, } from '../components/canvas-component.js';
import { addRectTransformComponent } from '../components/rect-transform-component.js';
import { UiAnchor } from '../types/ui-anchor.js';
import { uiCanvasRenderModes } from '../types/ui-canvas-render-mode.js';
/**
 * Creates a UI canvas: a root entity with a `CanvasEcsComponent` and
 * `RectTransformEcsComponent`. For `renderMode: 'screenSpace'` (the
 * default), also a dedicated, static UI camera with a transparent clear
 * color, its own off-screen `RenderTarget`, and a culling mask isolating it
 * from the world so a world camera whose own `cullingMask` still matches
 * everything doesn't draw UI content a second time. For
 * `renderMode: 'worldSpace'`, no camera is created - `options.camera` names
 * the (typically world) camera this canvas draws through instead.
 *
 * Call `registerUiSystems(world, renderContext, time)` once per `world`
 * before (or after - registration order between the two doesn't matter,
 * only tick order does) creating any canvases; this function only creates
 * the canvas entity itself; it never touches system registration, so it's
 * always safe to call once per canvas, however many canvases a world has.
 * @param world - The ECS world to create the canvas entity in.
 * @param renderContext - The render context a `'screenSpace'` canvas's UI
 * camera/render target is built against. Unused for `'worldSpace'`.
 * @param options - Options for configuring the canvas and its focus
 * navigation inputs. Which fields are available - `cullingMask`/
 * `referenceResolution`/`scaleMode`/`layer` vs. `camera`/`anchor`/
 * `anchoredPosition` - depends on `renderMode`, enforced at compile time
 * (see {@link ScreenSpaceUiCanvasOptions}/{@link WorldSpaceUiCanvasOptions}).
 * @returns The created canvas entity. Attach children to it with
 * `world.setParent(child, canvas)`, or use
 * `createPanel`/`createLabel`/`createButton`.
 */
export function createUiCanvas(world, renderContext, options) {
    const { submitInput, cancelInput, navigateInput } = options;
    const canvas = world.createEntity();
    addPositionComponent(world, canvas);
    if (options.renderMode === uiCanvasRenderModes.worldSpace) {
        const { camera, anchor = UiAnchor.center(), anchoredPosition } = options;
        addRectTransformComponent(world, canvas, {
            ...anchor,
            anchoredPosition,
        });
        addCanvasComponent(world, canvas, {
            camera,
            renderMode: uiCanvasRenderModes.worldSpace,
            submitInput,
            cancelInput,
            navigateInput,
        });
    }
    else {
        const { cullingMask, referenceResolution, scaleMode, layer = 1000, } = options;
        // Canvas-sized: the render context resizes it along with the canvas,
        // so the UI's target never drifts out of sync with the destination
        // it's composited onto.
        const renderTarget = createRenderTarget(renderContext, 'canvas');
        const camera = createCamera(world, {
            isStatic: true,
            cullingMask,
            layer,
            clearColor: Color.transparent,
            renderTarget,
            verticalWorldUnits: referenceResolution?.y ?? 1080,
        });
        // A `renderMode: 'screenSpace'` root's rect is fully recomputed from
        // the render destination's size on the very first layout pass (see
        // `createUiLayoutEcsSystem`) - its initial value here is never read.
        addRectTransformComponent(world, canvas);
        addCanvasComponent(world, canvas, {
            camera,
            renderMode: uiCanvasRenderModes.screenSpace,
            referenceResolution,
            scaleMode,
            submitInput,
            cancelInput,
            navigateInput,
        });
    }
    return canvas;
}
