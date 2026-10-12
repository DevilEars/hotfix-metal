import { Vector2 } from '../../math/index.js';
import { Aabb } from '../types/aabb.js';
import { Collider } from './collider.js';
/**
 * A circle collider: a `radius` around a `center` in the entity's local
 * space. The center turns with the entity, like a polygon's vertices.
 */
export declare class CircleCollider extends Collider {
    readonly type = "circle";
    radius: number;
    /**
     * The circle's center, in the entity's local space. Never mutate it:
     * it's also the collider's {@link localCenterOfMass}.
     */
    readonly center: Vector2;
    /**
     * Creates a new CircleCollider instance.
     * @param radius - The circle's radius.
     * @param density - The density used to derive mass from the circle's
     * area.
     * @param center - The circle's center, in the entity's local space.
     * Defaults to the entity's origin.
     */
    constructor(radius: number, density?: number, center?: Vector2);
    /**
     * Transforms the circle's local `center` into world space.
     * @param position - The world-space position of the entity.
     * @param rotation - The world-space rotation of the entity, in radians.
     * @returns The circle's world-space center, freshly allocated.
     */
    getWorldCenter(position: Vector2, rotation: number): Vector2;
    computeAabb(position: Vector2, rotation: number): Aabb;
}
