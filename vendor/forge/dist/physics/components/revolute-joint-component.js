import { rotationId } from '../../common/index.js';
import { createComponentId } from '../../ecs/ecs-component.js';
import { formatEntity } from '../../ecs/entity.js';
import { Vec2 } from '../../math/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const revoluteJointId = createComponentId('revolute-joint');
/**
 * Attaches a {@link RevoluteJointEcsComponent} to `entity`, pinning
 * `options.entityA` and `options.entityB` together at a shared anchor.
 * `entity` is a dedicated joint entity, not `entityA` or `entityB`
 * themselves. `entityA`/`entityB` must already have a `RotationEcsComponent`
 * (used to compute `referenceAngle`).
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The (dedicated) entity to attach the joint component to.
 * @param options - Options for configuring the joint.
 * @returns The attached component, for further tuning or runtime changes.
 * @throws An error if `lowerAngle` is greater than `upperAngle`, or
 * `entityA` or `entityB` has no `RotationEcsComponent`.
 */
export function addRevoluteJointComponent(world, entity, options) {
    const defaultOptions = {
        localAnchorA: Vec2.zero,
        localAnchorB: Vec2.zero,
        enableLimit: false,
        lowerAngle: 0,
        upperAngle: 0,
        hertz: 60,
        dampingRatio: 2,
    };
    const merged = withDefaults(defaultOptions, options);
    if (merged.lowerAngle > merged.upperAngle) {
        throw new Error(`Unable to add revolute joint to entity ${formatEntity(entity)}: lowerAngle (${merged.lowerAngle}) must be <= upperAngle (${merged.upperAngle}).`);
    }
    const rotationA = world.getComponent(options.entityA, rotationId);
    const rotationB = world.getComponent(options.entityB, rotationId);
    if (rotationA === null || rotationB === null) {
        throw new Error(`Unable to add revolute joint to entity ${formatEntity(entity)}: entityA and entityB must both have a RotationEcsComponent.`);
    }
    const component = {
        ...merged,
        referenceAngle: rotationB.world - rotationA.world,
        accumulatedPointImpulse: Vec2.zero,
    };
    return world.addComponent(entity, revoluteJointId, component);
}
