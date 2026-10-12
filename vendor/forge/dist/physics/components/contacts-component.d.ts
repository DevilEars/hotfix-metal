import { EcsWorld } from '../../ecs/ecs-world.js';
/**
 * The entities a collider entity is touching, and which of those contacts
 * started or ended this tick. Output only: `createNarrowPhaseEcsSystem`
 * writes all three lists every tick, replacing each with a new array, so
 * holding on to one of them keeps that tick's contents. Contacts are
 * opt-in: only collider entities with this component have theirs
 * recorded.
 *
 * Every overlap counts, including one with a sensor collider (which is
 * never resolved) and one with a body this entity is resting on.
 */
export interface ContactsEcsComponent {
    /**
     * The entities this one is touching this tick, each listed once (even
     * when the pair produced several collision manifolds, such as a body
     * resting across two of a terrain's edges). Another system may remove
     * one of them later in the same tick, so check `world.isAlive(entity)`
     * if an earlier system could have.
     */
    touching: readonly number[];
    /**
     * The entities in {@link ContactsEcsComponent.touching} that weren't
     * touching this one last tick.
     */
    started: readonly number[];
    /**
     * The entities that were touching this one last tick and aren't any
     * more: they moved apart, lost their collider, or were removed. Check
     * `world.isAlive(entity)` before treating one as still existing.
     */
    ended: readonly number[];
}
export declare const contactsId: import("../../ecs/ecs-component.js").ComponentKey<ContactsEcsComponent>;
/**
 * Attaches an empty {@link ContactsEcsComponent} to `entity`, so
 * `createNarrowPhaseEcsSystem` records what its collider touches.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @returns The attached component, for reading its contacts later.
 */
export declare function addContactsComponent(world: EcsWorld, entity: number): ContactsEcsComponent;
