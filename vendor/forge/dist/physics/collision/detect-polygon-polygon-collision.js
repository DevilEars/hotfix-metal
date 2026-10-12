import { detectPolygonFacesCollision } from './polygon-faces-collision.js';
/**
 * Detects a collision between two polygon-collider bodies, using the
 * separating axis theorem with reference/incident face clipping.
 * @param bodyA - The first body, with a {@link PolygonCollider}.
 * @param bodyB - The second body, with a {@link PolygonCollider}.
 * @returns A collision manifold (entity ids not yet populated, normal
 * pointing from `bodyA` toward `bodyB`) if the polygons overlap, otherwise
 * `null`.
 */
export function detectPolygonPolygonCollision(bodyA, bodyB) {
    const colliderA = bodyA.collider;
    const colliderB = bodyB.collider;
    const facesA = {
        vertices: colliderA.getWorldVertices(bodyA.position, bodyA.rotation),
        normals: colliderA.getWorldNormals(bodyA.rotation),
    };
    const facesB = {
        vertices: colliderB.getWorldVertices(bodyB.position, bodyB.rotation),
        normals: colliderB.getWorldNormals(bodyB.rotation),
    };
    return detectPolygonFacesCollision(facesA, facesB);
}
