import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { PrismaticJointEcsComponent } from '../components/prismatic-joint-component.js';
/**
 * Tuneable coefficients for `createPrismaticJointEcsSystem`'s solver.
 */
export interface PrismaticJointSystemOptions {
    /**
     * The number of velocity-solve iterations run per joint, per tick. See
     * `RevoluteJointSystemOptions.iterations` for the same rationale.
     */
    iterations: number;
}
/**
 * Creates an ECS system that resolves every `PrismaticJointEcsComponent`,
 * constraining each joint's `entityB` to slide relative to `entityA` only
 * along the joint's axis (and locking their relative rotation), using the
 * same warm-started, soft-constraint velocity solve as
 * `createCollisionResolutionEcsSystem`'s contact resolution. Must run after
 * `createCollisionResolutionEcsSystem` and before whatever system
 * integrates velocity into position (`createEulerIntegrationEcsSystem`).
 * @param time - Used to read the tick's delta time.
 * @param options - Tuning overrides for the solver; see
 * {@link PrismaticJointSystemOptions}.
 * @returns An ECS system that resolves every `PrismaticJointEcsComponent`
 * every tick.
 */
export declare const createPrismaticJointEcsSystem: (time: Time, options?: Partial<PrismaticJointSystemOptions>) => EcsSystem<[PrismaticJointEcsComponent]>;
