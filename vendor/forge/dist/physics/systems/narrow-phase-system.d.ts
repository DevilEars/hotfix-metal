import { EcsSystem } from '../../ecs/ecs-system.js';
import { ContactsEcsComponent } from '../components/contacts-component.js';
import { CollisionManifold } from '../types/collision-manifold.js';
import { CollisionPair } from '../types/collision-pair.js';
/**
 * Creates an ECS system that runs narrow-phase (SAT) collision detection
 * against every pair in `collisionPairs`, using each entity's world
 * position/rotation (local values are only meaningful to the parenting
 * system; an entity with no `RotationEcsComponent` is treated as unrotated).
 *
 * Every actual collision between two solid colliders is written into
 * `collisionManifolds`, the input to collision resolution. A single pair
 * can contribute more than one manifold - a body straddling several of a
 * `TerrainCollider`'s surface edges gets one per edge it touches (see
 * `detectCollision`). An overlap involving a sensor collider is never
 * written there, so it's never resolved.
 *
 * The system also owns every `ContactsEcsComponent`: it queries for them
 * and, each tick, rewrites their `touching`, `started` and `ended` lists
 * from this tick's overlaps, sensors included. An entity that has a
 * `ContactsEcsComponent` but no collider touches nothing, so its previous
 * contacts end.
 * @param collisionPairs - The broad-phase system's output: candidate
 * entity pairs whose AABBs overlap, each pair listed once.
 * @param collisionManifolds - The array the system clears and refills with
 * the current tick's confirmed collisions between solid colliders.
 * @returns An ECS system that populates `collisionManifolds` and every
 * `ContactsEcsComponent` every tick.
 */
export declare const createNarrowPhaseEcsSystem: (collisionPairs: CollisionPair[], collisionManifolds: CollisionManifold[]) => EcsSystem<[ContactsEcsComponent]>;
