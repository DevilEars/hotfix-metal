import { Time } from '../../common/index.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
import { CollisionManifold } from '../types/collision-manifold.js';
import { ContactConstraint } from '../types/contact-constraint.js';
/**
 * Tuneable coefficients for `createCollisionResolutionEcsSystem`'s solver.
 */
export interface CollisionResolutionOptions {
    /**
     * The number of Gauss-Seidel iterations the solver runs per tick. Box2D
     * recommends a minimum of 4; higher values converge more accurately at a
     * higher cost.
     */
    iterations: number;
    /**
     * The target frequency, in Hz, of the soft constraint used to correct
     * contact penetration. Higher values correct penetration faster at the
     * cost of added stiffness/energy.
     */
    contactHertz: number;
    /**
     * The damping ratio of the soft constraint used to correct contact
     * penetration.
     */
    contactDampingRatio: number;
    /**
     * The maximum speed, in world units/second, the penetration-correction
     * bias is allowed to introduce in a single tick. The default mirrors
     * Box2D's own `contactPushMaxSpeed`, which assumes meters-scale world
     * units - at a larger scale (e.g. a world where a typical dynamic body
     * spans hundreds of units, not roughly one), recovering from a deep
     * penetration (a fast body landing hard after a jump, say) can take
     * visibly long at this default, since the cap - not the soft constraint's
     * own stiffness - is what limits how fast large penetration clears.
     * Scale it up roughly in proportion to how much larger a "typical body"
     * is in your world than roughly a meter (the Car demo's `_create-game.ts`
     * has a worked example).
     */
    maxBiasSpeed: number;
    /**
     * The minimum closing speed (along the contact normal) a new contact must
     * have for restitution to be applied to it.
     */
    restitutionThreshold: number;
    /**
     * The allowed penetration depth (a small slop, as Box2D uses) below which
     * the solver stops trying to correct penetration, to prevent jitter.
     */
    slop: number;
}
/**
 * Creates an ECS system that resolves every collision in
 * `collisionManifolds` into velocity changes, using a sequential-impulse
 * (Gauss-Seidel) solver with soft-constraint penetration correction,
 * Coulomb friction, and restitution. Warm-starts each contact point's
 * accumulated impulses across ticks via `contactConstraints`, matched up by
 * entity pair and feature id, for fast convergence and stable resting
 * contacts. Must run after whatever system populates `collisionManifolds`
 * (`createNarrowPhaseEcsSystem`) and before whatever system integrates
 * velocity into position (`createEulerIntegrationEcsSystem`).
 * @param collisionManifolds - The narrow-phase system's output: this tick's
 * confirmed collisions.
 * @param contactConstraints - The array the system clears and refills with
 * the current tick's persistent contact solver state. Passing the same
 * array back in on the next tick is what enables warm-starting.
 * @param time - Used to read the tick's delta time.
 * @param options - Tuning overrides for the solver; see
 * {@link CollisionResolutionOptions}.
 * @returns An ECS system that resolves `collisionManifolds` every tick.
 */
export declare const createCollisionResolutionEcsSystem: (collisionManifolds: CollisionManifold[], contactConstraints: ContactConstraint[], time: Time, options?: Partial<CollisionResolutionOptions>) => EcsSystem<[]>;
