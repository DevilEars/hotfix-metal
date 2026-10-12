import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { RevoluteJointEcsComponent } from '../components/revolute-joint-component.js';
/**
 * Tuneable coefficients for `createRevoluteJointEcsSystem`'s solver.
 */
export interface RevoluteJointSystemOptions {
    /**
     * The number of velocity-solve iterations run per joint, per tick. Each
     * revolute joint is an isolated 2-3 DOF relationship (unlike contacts,
     * which may need several iterations to converge a stack), so `1` is
     * usually enough; raise it if a chain of joints sharing a body (e.g. a
     * vehicle's suspension) shows jitter.
     */
    iterations: number;
}
/**
 * Creates an ECS system that resolves every `RevoluteJointEcsComponent`,
 * pinning each joint's two entities together at their shared anchor (and
 * optionally clamping their relative angle), using the same warm-started,
 * soft-constraint velocity solve as `createCollisionResolutionEcsSystem`'s
 * contact resolution. Must run after `createCollisionResolutionEcsSystem`
 * (so joints get the "last word" on velocity each tick) and before whatever
 * system integrates velocity into position (`createEulerIntegrationEcsSystem`).
 * @param time - Used to read the tick's delta time.
 * @param options - Tuning overrides for the solver; see
 * {@link RevoluteJointSystemOptions}.
 * @returns An ECS system that resolves every `RevoluteJointEcsComponent`
 * every tick.
 */
export declare const createRevoluteJointEcsSystem: (time: Time, options?: Partial<RevoluteJointSystemOptions>) => EcsSystem<[RevoluteJointEcsComponent]>;
