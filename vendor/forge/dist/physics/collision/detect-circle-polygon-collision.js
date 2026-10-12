import { Vec2 } from '../../math/index.js';
import { findCircleContact, findClosestFace, } from './circle-polygon-contact.js';
/**
 * Detects a collision between a circle-collider body and a
 * polygon-collider body.
 * @param circleBody - The body with a {@link CircleCollider}.
 * @param polygonBody - The body with a {@link PolygonCollider}.
 * @returns A collision manifold (entity ids not yet populated, normal
 * pointing from `circleBody` toward `polygonBody`) if the shapes overlap,
 * otherwise `null`.
 */
export function detectCirclePolygonCollision(circleBody, polygonBody) {
    const circleCollider = circleBody.collider;
    const polygonCollider = polygonBody.collider;
    const { radius } = circleCollider;
    const { vertices, normals } = polygonCollider;
    const localCenter = Vec2.rotate(Vec2.subtract(circleCollider.getWorldCenter(circleBody.position, circleBody.rotation), polygonBody.position), -polygonBody.rotation);
    const closestFace = findClosestFace(vertices, normals, localCenter, radius);
    if (closestFace === null) {
        return null;
    }
    const contact = findCircleContact(vertices, normals, localCenter, closestFace.faceIndex, closestFace.separation, radius);
    if (contact === null) {
        return null;
    }
    // `contact.localNormal`/`contact.localContactPoint` are always fresh
    // clones (see circle-polygon-contact.ts), so mutating them in place here
    // is safe.
    const normal = Vec2.negate(Vec2.rotate(contact.localNormal, polygonBody.rotation));
    const contactPoint = Vec2.add(Vec2.rotate(contact.localContactPoint, polygonBody.rotation), polygonBody.position);
    return {
        normal,
        depth: contact.depth,
        contactPoints: [contactPoint],
        featureIds: [0],
    };
}
