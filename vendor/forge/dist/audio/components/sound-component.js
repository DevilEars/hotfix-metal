import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const soundId = createComponentId('sound');
const defaultSoundOptions = {
    volume: 1,
    rate: 1,
    loop: false,
    paused: false,
};
/**
 * Attaches a {@link SoundEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - The sound, its bus, and how to play it. `sound` and
 * `bus` have no sensible default and must always be provided.
 * @returns The attached component, for runtime changes.
 */
export function addSoundComponent(world, entity, options) {
    const component = {
        ...withDefaults(defaultSoundOptions, options),
        hasFinished: false,
    };
    return world.addComponent(entity, soundId, component);
}
