import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { RenderContext } from '../../rendering/index.js';
import { RectTransformEcsComponent } from '../components/rect-transform-component.js';
import { TextInputEcsComponent } from '../components/text-input-component.js';
import { UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
/**
 * Creates the system that runs every `TextInputEcsComponent`: it decides
 * when a field is being edited, mirrors and filters its value, raises its
 * events, keeps its hidden input over it on screen, and draws its text,
 * placeholder, caret, selection and IME composition underline.
 *
 * **Editing.** A field is being edited exactly while its hidden input has
 * focus. Editing starts when the field is invoked (a click, a tap, or the
 * canvas's `submitInput` while it has UI focus) or through
 * `editTextInput`, and ends on Enter (`onSubmit`), Escape (`onCancel`), or
 * when the browser takes focus away (a click elsewhere, a phone's "Done"
 * key, switching tabs). Hovering or navigating to another element doesn't
 * end it. A field that isn't interactable (itself or through a canvas
 * group) can't be edited.
 *
 * **Phone keyboards.** A phone only opens its keyboard when an input is
 * focused inside a user gesture's event handler, and an ECS tick runs
 * later. So the system listens for `pointerup` on the canvas's container
 * and runs the UI's own hit test (`raycastUiCanvas`) right there: if the
 * press and release both landed on the same field, and it's the only
 * element hit on any canvas, its input is focused inside the gesture.
 *
 * **Value.** Outside an IME composition, the input's text is filtered
 * (characters the field's font has no glyph for are dropped, then the
 * field's `filter` runs, then `maxLength` applies), written back to the
 * input if filtering changed it, and copied to `value`, raising
 * `onValueChanged`. During a composition the uncommitted text is shown,
 * underlined, but isn't part of `value`.
 *
 * **Visuals.** The caret and selection are placed from the text label's
 * `TextMeshEcsComponent.caretStops`. Text shaping and layout run after
 * this system, so they trail the typed text by a frame or two. The caret
 * blinks, restarting whenever the text or selection changes.
 *
 * Fields on world-space canvases are edited and drawn the same way, but
 * their hidden input isn't moved over them.
 *
 * Every field's input is removed when its component is, and all of them
 * are removed in `cleanup`.
 *
 * Must be registered after `createUiNavigationEcsSystem` and
 * `createUiInteractionEcsSystem` (it reads `wasInvokedThisFrame`), which
 * `registerUiSystems` does.
 * @param renderContext - The render context whose canvas the fields are
 * drawn on. Its canvas's parent element receives the tap listeners.
 * @param time - The time the caret blinks by. It uses unscaled time, so
 * the caret blinks while the game is paused.
 * @returns The UI text input ECS system.
 */
export declare const createUiTextInputEcsSystem: (renderContext: RenderContext, time: Time) => EcsSystem<[TextInputEcsComponent, UiInteractableEcsComponent, RectTransformEcsComponent]>;
