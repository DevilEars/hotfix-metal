import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { SpriteEcsComponent } from '../../rendering/index.js';
import { UiColorTransitionEcsComponent } from '../components/ui-color-transition-component.js';
import { UiInteractableEcsComponent } from '../components/ui-interactable-component.js';
/**
 * Creates a system that eases a `SpriteEcsComponent.tintColor` towards
 * whichever of a `UiColorTransitionEcsComponent`'s `normalColor`/
 * `hoverColor`/`pressedColor`/`disabledColor` matches the entity's
 * `UiInteractableEcsComponent`, per `deriveUiInteractionVisualState` -
 * giving buttons hover/press/disabled visual feedback via the engine's
 * existing easing functions (`animations/easing-functions`), with no
 * transition component having to know whether the state came from a
 * pointer or a gamepad.
 *
 * Should be registered after `createUiInteractionEcsSystem` and
 * `createUiNavigationEcsSystem` (it reads the interaction state they
 * write) and before `createRenderEcsSystem`.
 * @param time - The time instance driving the tween.
 * @returns The UI transition ECS system.
 */
export declare const createUiTransitionEcsSystem: (time: Time) => EcsSystem<[UiColorTransitionEcsComponent, UiInteractableEcsComponent, SpriteEcsComponent]>;
