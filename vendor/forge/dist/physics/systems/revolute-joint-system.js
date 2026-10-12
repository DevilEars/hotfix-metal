import { Matrix2x2, Vec2 } from '../../math/index.js';
import { revoluteJointId, } from '../components/revolute-joint-component.js';
import { applyPointImpulse } from '../joints/apply-point-impulse.js';
import { getJointLeverArm, resolveJointBody, } from '../joints/resolve-joint-body.js';
import { velocityAtPoint } from '../joints/velocity-at-point.js';
import { getSoftConstraintParams } from '../solve-soft-constraint.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const defaultRevoluteJointSystemOptions = {
    iterations: 1,
};
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
export const createRevoluteJointEcsSystem = (time, options = {}) => {
    const resolvedOptions = withDefaults(defaultRevoluteJointSystemOptions, options);
    return {
        query: [revoluteJointId],
        update: (world, { components: [joints] }) => {
            const dt = time.deltaTimeInSeconds;
            if (dt <= 0) {
                return;
            }
            const prepared = [];
            for (const joint of joints) {
                const bodyA = resolveJointBody(world, joint.entityA);
                const bodyB = resolveJointBody(world, joint.entityB);
                if (bodyA === null || bodyB === null) {
                    continue;
                }
                prepared.push(prepareJoint(joint, bodyA, bodyB));
            }
            for (const joint of prepared) {
                warmStart(joint);
            }
            for (let i = 0; i < resolvedOptions.iterations; i++) {
                for (const joint of prepared) {
                    solvePoint(joint, dt);
                    solveLimit(joint, dt);
                }
            }
        },
    };
};
function prepareJoint(joint, bodyA, bodyB) {
    const rA = getJointLeverArm(bodyA, joint.localAnchorA);
    const rB = getJointLeverArm(bodyB, joint.localAnchorB);
    const k00 = bodyA.invMass +
        bodyB.invMass +
        bodyA.invInertia * rA.y * rA.y +
        bodyB.invInertia * rB.y * rB.y;
    const k01 = -bodyA.invInertia * rA.x * rA.y - bodyB.invInertia * rB.x * rB.y;
    const k11 = bodyA.invMass +
        bodyB.invMass +
        bodyA.invInertia * rA.x * rA.x +
        bodyB.invInertia * rB.x * rB.x;
    // Clone before adding: the bodies' `centerOfMass` is read again by
    // later solve steps.
    const worldAnchorA = Vec2.add(Vec2.clone(bodyA.centerOfMass), rA);
    const worldAnchorB = Vec2.add(Vec2.clone(bodyB.centerOfMass), rB);
    return {
        joint,
        bodyA,
        bodyB,
        rA,
        rB,
        pointMatrix: new Matrix2x2(k00, k01, k01, k11),
        pointSeparation: Vec2.subtract(worldAnchorB, worldAnchorA),
        angle: bodyB.rotation - bodyA.rotation - joint.referenceAngle,
    };
}
function warmStart(prepared) {
    const { joint, bodyA, bodyB, rA, rB } = prepared;
    // Clone before negating: `joint.accumulatedPointImpulse` is a persistent
    // warm-start field, still needed unmodified for bodyB's call right after.
    applyPointImpulse(bodyA.rigidBody, rA, bodyA.invMass, bodyA.invInertia, Vec2.negate(Vec2.clone(joint.accumulatedPointImpulse)));
    applyPointImpulse(bodyB.rigidBody, rB, bodyB.invMass, bodyB.invInertia, joint.accumulatedPointImpulse);
}
function solvePoint(prepared, dt) {
    const { joint, bodyA, bodyB, rA, rB, pointMatrix, pointSeparation } = prepared;
    const relativeVelocity = Vec2.subtract(velocityAtPoint(bodyB.rigidBody, rB), velocityAtPoint(bodyA.rigidBody, rA));
    const maxHertz = 0.25 / dt;
    const soft = getSoftConstraintParams(Math.min(joint.hertz, maxHertz), joint.dampingRatio, dt);
    // Clone before scaling: `pointSeparation` persists across every solve
    // iteration this tick.
    const bias = Vec2.multiply(Vec2.clone(pointSeparation), soft.biasRate);
    // The impulseScale decay term is a fraction of the accumulated impulse
    // itself, not something to run back through the effective-mass solve (a
    // second division by mass there would make the correction grow with the
    // square of the bodies' mass instead of staying scale-invariant).
    const rhs = Vec2.negate(Vec2.add(Vec2.multiply(relativeVelocity, soft.massScale), bias));
    // Clone before scaling: `joint.accumulatedPointImpulse` persists across
    // every solve iteration this tick.
    const impulse = Vec2.subtract(pointMatrix.solve(rhs), Vec2.multiply(Vec2.clone(joint.accumulatedPointImpulse), soft.impulseScale));
    joint.accumulatedPointImpulse = Vec2.add(joint.accumulatedPointImpulse, impulse);
    // Clone before negating: `impulse` is still needed unmodified for bodyB's
    // call right after.
    applyPointImpulse(bodyA.rigidBody, rA, bodyA.invMass, bodyA.invInertia, Vec2.negate(Vec2.clone(impulse)));
    applyPointImpulse(bodyB.rigidBody, rB, bodyB.invMass, bodyB.invInertia, impulse);
}
/**
 * Solves the (optional) angle-limit constraint. Unlike the point constraint,
 * this isn't warm-started: with no ongoing external force (like gravity) to
 * counteract each tick, persisting and re-applying an accumulated impulse
 * every tick has nothing to balance against and compounds. Instead, each
 * solve computes a fresh, one-sided velocity correction directly from the
 * current violation, matching the reference `simple_phys.js`'s
 * `solveAngleLimits`.
 */
function solveLimit(prepared, dt) {
    const { joint, bodyA, bodyB, angle } = prepared;
    if (!joint.enableLimit) {
        return;
    }
    const invInertiaSum = bodyA.invInertia + bodyB.invInertia;
    if (invInertiaSum < 1e-6) {
        return;
    }
    let separation;
    if (angle <= joint.lowerAngle) {
        separation = angle - joint.lowerAngle;
    }
    else if (angle >= joint.upperAngle) {
        separation = angle - joint.upperAngle;
    }
    else {
        return;
    }
    const velocityError = (bodyB.rigidBody?.angularVelocity ?? 0) -
        (bodyA.rigidBody?.angularVelocity ?? 0);
    const maxHertz = 0.25 / dt;
    const soft = getSoftConstraintParams(Math.min(joint.hertz, maxHertz), joint.dampingRatio, dt);
    const bias = soft.biasRate * separation;
    let lambda = -(soft.massScale * velocityError + bias) / invInertiaSum;
    lambda = separation > 0 ? Math.min(lambda, 0) : Math.max(lambda, 0);
    if (bodyA.rigidBody !== null) {
        bodyA.rigidBody.angularVelocity -= bodyA.invInertia * lambda;
    }
    if (bodyB.rigidBody !== null) {
        bodyB.rigidBody.angularVelocity += bodyB.invInertia * lambda;
    }
}
