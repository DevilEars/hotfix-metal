import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
/**
 * Component key for {@link SpriteAnimationEcsComponent}.
 */
export const spriteAnimationId = createComponentId('sprite-animation');
const defaultSpriteAnimationOptions = {
    animationFrameIndex: 0,
    playbackSpeed: 1,
    frameDurationMilliseconds: 100,
    lastFrameChangeTimeInSeconds: 0,
};
/**
 * Attaches a {@link SpriteAnimationEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the sprite animation.
 * `animationClipHandle` has no sensible default and must always be
 * provided.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addSpriteAnimationComponent(world, entity, options) {
    const component = withDefaults(defaultSpriteAnimationOptions, options);
    return world.addComponent(entity, spriteAnimationId, component);
}
