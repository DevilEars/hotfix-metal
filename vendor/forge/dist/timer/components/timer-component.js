import { createComponentId } from '../../ecs/ecs-component.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const TimerId = createComponentId('Timer');
/**
 * Attaches a {@link TimerEcsComponent} to `entity`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the timer.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addTimerComponent(world, entity, options = {}) {
    // `tasks` defaults to a fresh array per call (rather than a shared
    // module-level default) since it's mutated in place by callers.
    const defaultTimerOptions = {
        tasks: [],
    };
    const component = withDefaults(defaultTimerOptions, options);
    return world.addComponent(entity, TimerId, component);
}
