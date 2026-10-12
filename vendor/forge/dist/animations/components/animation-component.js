import { linear } from '../easing-functions/index.js';
import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * Component key for {@link AnimationEcsComponent}.
 */
export const animationId = createComponentId('animation');
/**
 * Default values applied to any {@link AnimatedProperty} field not provided to {@link createAnimatedProperty}.
 */
export const animationDefaults = {
    startValue: 0,
    endValue: 1,
    elapsed: 0,
    easing: linear,
    loop: 'none',
    loopCount: -1,
    finishedCallback: () => undefined,
};
/**
 * Fills in {@link animationDefaults} for any field not provided, producing a fully populated animated property ready to push onto {@link AnimationEcsComponent.animations}.
 * @param animatedProperty - The animated property to apply defaults to.
 * @returns The animated property with all optional fields populated.
 */
export const createAnimatedProperty = (animatedProperty) => ({
    ...animationDefaults,
    ...animatedProperty,
});
/**
 * Attaches a {@link AnimationEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the animation.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addAnimationComponent(world, entity, options = {}) {
    // `animations` defaults to a fresh array per call (rather than a shared
    // module-level default) since it's mutated in place by callers.
    const defaultAnimationOptions = {
        animations: [],
    };
    const component = withDefaults(defaultAnimationOptions, options);
    return world.addComponent(entity, animationId, component);
}
