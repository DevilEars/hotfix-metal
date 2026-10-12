import { Vec2 } from '../../math/index.js';
import { Collider } from './collider.js';
function calculateCircleMass(radius, density = 1) {
    return density * Math.PI * radius * radius;
}
function calculateCircleMomentOfInertia(radius, mass) {
    return (mass * radius * radius) / 2;
}
/**
 * A circle collider: a `radius` around a `center` in the entity's local
 * space. The center turns with the entity, like a polygon's vertices.
 */
export class CircleCollider extends Collider {
    type = 'circle';
    radius;
    /**
     * The circle's center, in the entity's local space. Never mutate it:
     * it's also the collider's {@link localCenterOfMass}.
     */
    center;
    /**
     * Creates a new CircleCollider instance.
     * @param radius - The circle's radius.
     * @param density - The density used to derive mass from the circle's
     * area.
     * @param center - The circle's center, in the entity's local space.
     * Defaults to the entity's origin.
     */
    constructor(radius, density = 1, center = Vec2.zero) {
        const mass = calculateCircleMass(radius, density);
        const momentOfInertia = calculateCircleMomentOfInertia(radius, mass);
        // Clone: the caller may reuse or mutate the vector it passed in.
        const localCenter = Vec2.clone(center);
        super(mass, momentOfInertia, localCenter);
        this.radius = radius;
        this.center = localCenter;
    }
    /**
     * Transforms the circle's local `center` into world space.
     * @param position - The world-space position of the entity.
     * @param rotation - The world-space rotation of the entity, in radians.
     * @returns The circle's world-space center, freshly allocated.
     */
    getWorldCenter(position, rotation) {
        // Clone before rotating: `this.center` is the collider's own data.
        return Vec2.add(Vec2.rotate(Vec2.clone(this.center), rotation), position);
    }
    computeAabb(position, rotation) {
        const center = this.getWorldCenter(position, rotation);
        return {
            min: { x: center.x - this.radius, y: center.y - this.radius },
            max: { x: center.x + this.radius, y: center.y + this.radius },
        };
    }
}
