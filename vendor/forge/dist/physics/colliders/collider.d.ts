import { Vector2 } from '../../math/index.js';
import { Aabb } from '../types/aabb.js';
/**
 * A collision shape, defined in the local space of the entity it's attached
 * to: the entity's world position and rotation place it in the world.
 *
 * A collider also carries the mass data a dynamic `RigidBodyEcsComponent`
 * on the same entity simulates with, computed from the shape's area and
 * density.
 */
export declare abstract class Collider {
    abstract readonly type: 'circle' | 'polygon' | 'terrain';
    /**
     * The shape's mass: its area times its density.
     */
    readonly mass: number;
    /**
     * The shape's moment of inertia about its center of mass
     * ({@link localCenterOfMass}).
     */
    readonly momentOfInertia: number;
    /**
     * The shape's center of mass (its centroid, for a uniform density), in
     * the entity's local space. A dynamic body turns about this point.
     *
     * Never mutate it: it's the collider's own data, and several bodies can
     * share one collider.
     */
    readonly localCenterOfMass: Vector2;
    constructor(mass: number, momentOfInertia: number, localCenterOfMass: Vector2);
    abstract computeAabb(position: Vector2, rotation: number): Aabb;
}
