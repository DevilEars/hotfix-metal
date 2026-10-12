import { ComponentKey, TagKey } from './ecs-component.js';
import { EcsSystemGroup } from './ecs-system-group.js';
import { Stoppable, Updatable } from '../common/index.js';
import { ParameterizedForgeEvent } from '../events/parameterized-forge-event.js';
import { EcsSystem } from './ecs-system.js';
import { RunCondition } from './run-condition.js';
/**
 * The entities matching a query, and their components. Both are new arrays
 * built when the query runs, so they don't change when the world does.
 * @typeParam T - The queried component types, in query order.
 */
export interface QueryResult<T extends readonly unknown[]> {
    /** The matching entities' handles. */
    entities: readonly number[];
    /**
     * One array per queried component key, in query order: `components[k][i]`
     * is the component for key `k` of `entities[i]`.
     */
    components: {
        [K in keyof T]: T[K][];
    };
}
/**
 * Options for `EcsWorld.addSystem`.
 */
export interface AddSystemOptions {
    /**
     * Which group to register the system in. Defaults to the world's
     * `defaultSystemGroup` when omitted.
     */
    group?: EcsSystemGroup;
    /**
     * Systems that must run before this one. Every referenced system must
     * already be registered (via `addSystem`) in the same group as this one.
     */
    before?: EcsSystem[];
    /**
     * Systems that must run after this one. Every referenced system must
     * already be registered (via `addSystem`) in the same group as this one.
     */
    after?: EcsSystem[];
    /**
     * Runs the system only on ticks where this returns `true`. Checked each
     * tick just before the system would run, after its group's own `runIf`.
     * A system that doesn't run isn't queried.
     */
    runIf?: RunCondition;
}
/**
 * Options for `EcsWorld.addSystemGroup`.
 */
export interface AddSystemGroupOptions {
    /**
     * Groups that must run before this one. Every referenced group must
     * already be registered via `addSystemGroup`.
     */
    before?: EcsSystemGroup[];
    /**
     * Groups that must run after this one. Every referenced group must
     * already be registered via `addSystemGroup`.
     */
    after?: EcsSystemGroup[];
    /**
     * Runs the group's systems only on ticks where this returns `true`.
     * Checked each tick just before the group would run.
     */
    runIf?: RunCondition;
}
/**
 * Holds a set of entities, their components and tags, and the systems that
 * process them. Creates and removes entities, answers queries, and runs its
 * systems once per `update()` call.
 */
export declare class EcsWorld implements Updatable, Stoppable {
    /**
     * Raised by `removeEntity` with the removed entity, once its components
     * and tags are gone. The entity is no longer alive by then, so removing it
     * again from a listener does nothing.
     */
    readonly onEntityRemoved: ParameterizedForgeEvent<number>;
    private readonly _componentSets;
    private readonly _childrenByParent;
    private readonly _liveHandles;
    private readonly _freeHandles;
    private _freeHandlesHead;
    private readonly _creationSequences;
    private _nextCreationSequence;
    private readonly _systemGraphsByGroup;
    private readonly _groupBySystem;
    private readonly _groupGraph;
    private readonly _firstSystemGroup;
    private readonly _defaultSystemGroup;
    private readonly _startOfTickGroups;
    private readonly _restOfTickGroups;
    private readonly _systemRunConditions;
    private readonly _groupRunConditions;
    constructor();
    /**
     * The group that runs before every other group of the tick, however the
     * other groups are ordered. Game state transitions run in it. Ordering a
     * group `before` it throws.
     *
     * A group ordered `after` it, or after another group ordered that way, is
     * a start-of-tick group: it runs before every other group, including
     * groups registered later. A game state's exit and enter groups are
     * start-of-tick groups.
     */
    get firstSystemGroup(): EcsSystemGroup;
    /**
     * The system group systems are registered into when `addSystem` is called
     * without a `group` option. Order your own groups relative to it (via
     * `addSystemGroup`'s `before`/`after`) to run consistently before or after
     * every system a caller registers without specifying a group.
     */
    get defaultSystemGroup(): EcsSystemGroup;
    /**
     * Calls `cleanup` on every registered system, in the order they run. The
     * systems stay registered. `Game.stop` calls it.
     */
    stop(): void;
    /**
     * Registers a system group, ordering it relative to other groups. Every
     * group runs after `firstSystemGroup`. A group ordered `after` the first
     * group, or after another group that is, runs at the start of the tick,
     * before every other group.
     * @param group - The group to register.
     * @param options - `before`/`after` groups to order this group against,
     * and a `runIf` condition. Every referenced group must already be
     * registered.
     * @throws An error if `group` is the first group, if it's ordered before
     * the first group, if a start-of-tick group is ordered after a group
     * that isn't, or if a group that isn't is ordered before one that is.
     */
    addSystemGroup(group: EcsSystemGroup, options?: AddSystemGroupOptions): void;
    /**
     * Registers a system, optionally ordering it relative to other systems in
     * its group, and calls its `onRegister`. Systems with no ordering
     * constraint between them run in the order they were added. A system added
     * while `update()` is running its systems first runs on the next tick.
     * @param system - The system to register.
     * @param options - Which group to register the system in, `before`/
     * `after` systems (within that same group) to order it against, and a
     * `runIf` condition.
     * @throws An error if `options.group` isn't registered, if a `before`/
     * `after` system isn't registered in the same group, or if the ordering
     * would create a cycle.
     */
    addSystem<T extends readonly unknown[]>(system: EcsSystem<T>, options?: AddSystemOptions): void;
    /**
     * Unregisters a system and calls its `cleanup`. A system removed while
     * `update()` is running its systems still runs in that tick, since the
     * tick's list of systems is taken before the first one runs.
     * @param system - The system to remove.
     */
    removeSystem<T extends readonly unknown[]>(system: EcsSystem<T>): void;
    /**
     * Runs one tick: every group in order, and every system of each group in
     * order. A group or system whose `runIf` returns `false` is skipped
     * without being queried. Conditions are checked just before the group or
     * system would run, so they see what earlier systems of the tick did.
     */
    update(): void;
    /**
     * Finds the entities that have every component in `componentKeys` and
     * every tag in `tags`. Builds new arrays on every call; for per-frame
     * processing, register a system with a `query` instead.
     * @param componentKeys - The components an entity must have. Their data is
     * returned in this order.
     * @param tags - The tags an entity must have.
     * @returns The matching entities and their components.
     */
    query<T extends readonly unknown[]>(componentKeys: readonly ComponentKey<unknown>[], tags?: readonly TagKey[]): QueryResult<T>;
    /**
     * Creates an entity. It stays alive, with or without components, until
     * `removeEntity` removes it.
     * @returns The new entity's handle.
     * @throws An error if the world already holds the maximum number of
     * entities.
     */
    createEntity(): number;
    /**
     * Reads where an entity comes in the order entities were created in: an
     * entity created later has a higher sequence number, even when it reuses a
     * removed entity's slot. Root entities draw in this order.
     * @param entity - The entity.
     * @returns Its creation sequence number.
     * @throws An error if the entity isn't alive.
     */
    getCreationSequence(entity: number): number;
    /**
     * Whether `entity` was created by this world and hasn't been removed
     * since. A handle to a removed entity stays not alive even once a new
     * entity has reused its slot.
     * @param entity - The entity handle.
     * @returns `true` if the entity is alive.
     */
    isAlive(entity: number): boolean;
    /**
     * Removes an entity, its descendants, and all of their components and
     * tags. Children are removed first, depth first and in sibling order, so
     * `onEntityRemoved` is raised for every descendant before the entity
     * itself. Does nothing if the entity isn't alive, e.g. it was already
     * removed earlier this tick.
     *
     * The entity stops being alive before its children are removed, but keeps
     * its components until they're gone, so an `onEntityRemoved` listener for
     * a descendant can still read its ancestors' components. To keep a child,
     * call `removeParent` (or `setParent` with another parent) first.
     * @param entity - The entity to remove.
     * @returns `true` if the entity was removed, `false` if it wasn't alive.
     */
    removeEntity(entity: number): boolean;
    /**
     * Makes `child` a child of `parent`, replacing any parent it has: it's
     * appended to `parent`'s children, removed along with `parent`, and its
     * transform follows `parent`'s. Its local transform is kept as it is, so
     * it takes the same offset under its new parent. Setting its current
     * parent again does nothing, and keeps its place among its siblings.
     * @param child - The entity to parent.
     * @param parent - Its new parent.
     * @throws An error if either entity isn't alive, or if `parent` is `child`
     * or one of its descendants.
     */
    setParent(child: number, parent: number): void;
    /**
     * Makes `child` a root entity again. Its local transform is kept as it
     * is, so it's now relative to the world. Does nothing if it has no parent.
     * @param child - The entity to unparent.
     */
    removeParent(child: number): void;
    /**
     * Reads an entity's parent.
     * @param child - The entity.
     * @returns Its parent, or `null` if it's a root entity or isn't alive.
     */
    getParent(child: number): number | null;
    /**
     * Reads an entity's children, in sibling order: the order they were
     * parented to it in. Removing a child, or moving it to another parent,
     * keeps its siblings in order.
     * @param parent - The entity.
     * @returns A read-only view of the world's own list, which changes as
     * children are added or removed, so copy it before removing or reparenting
     * children in a loop. Empty if the entity has no children.
     */
    getChildren(parent: number): readonly number[];
    /**
     * Adds a component to an entity, replacing any it already has for
     * `componentKey`.
     * @param entity - The entity to add the component to.
     * @param componentKey - The component's key.
     * @param componentData - The component.
     * @returns `componentData`.
     * @throws An error if `entity` isn't alive, or if `componentKey` is
     * `parentId` (use `setParent`).
     */
    addComponent<T>(entity: number, componentKey: ComponentKey<T>, componentData: T): T;
    /**
     * Adds a tag to an entity.
     * @param entity - The entity to tag.
     * @param tagKey - The tag's key.
     * @throws An error if `entity` isn't alive.
     */
    addTag(entity: number, tagKey: TagKey): void;
    /**
     * Reads one of an entity's components.
     * @param entity - The entity to read the component from.
     * @param componentKey - The component's key.
     * @returns The component, or `null` if the entity doesn't have one for
     * `componentKey` or isn't alive.
     */
    getComponent<T>(entity: number, componentKey: ComponentKey<T>): T | null;
    /**
     * Returns a fast accessor for a single component type, resolving its
     * underlying storage once instead of on every call - useful when a
     * system needs to look up the same optional component (one not every
     * entity has, so it can't just be added to `query`'s required keys) for
     * many entities in a tight loop. `getComponent` re-resolves `componentKey`
     * to its storage on every single call; this instead does that resolution
     * once and returns a function that goes straight to the resolved storage.
     * @param componentKey - The component's key.
     * @returns A function mapping an entity to its component for
     * `componentKey`, or `null` if that entity doesn't have one. Reflects
     * components added to `componentKey` after this call, as long as at
     * least one entity in the world already had `componentKey` at the time
     * this was called - so call it fresh (e.g. once per system update) rather
     * than caching it across ticks of a world that might not have used
     * `componentKey` yet on the first call.
     */
    getComponentAccessor<T>(componentKey: ComponentKey<T>): (entity: number) => T | null;
    /**
     * Reads a component the caller expects to already exist, throwing instead
     * of returning `null` if it doesn't - for the common case of re-reading a
     * component this same call site just attached, where a `null` would mean a
     * broken invariant rather than a legitimate "doesn't have it" case.
     * @param entity - The entity to read the component from.
     * @param componentKey - The component's key.
     * @returns The component.
     * @throws An error if `entity` doesn't have a component for `componentKey`.
     */
    getComponentRequired<T>(entity: number, componentKey: ComponentKey<T>): T;
    /**
     * Removes one of an entity's components. The entity stays alive, whether
     * or not it has any components left; remove it with `removeEntity`. Does
     * nothing if the entity doesn't have the component or isn't alive.
     * @param entity - The entity to remove the component from.
     * @param componentKey - The component's key.
     * @throws An error if `componentKey` is `parentId` (use `removeParent`).
     */
    removeComponent<T>(entity: number, componentKey: ComponentKey<T>): void;
    private _requireAlive;
    private _requireAliveFor;
    private _removeChildren;
    private _detachFromParent;
    private _compactFreeHandles;
    private _entityHasAllKeys;
    private _getDriverComponentSet;
    private _getComponentSet;
    private _getComponentOrCreateSetByKey;
    private _requireSameGroup;
    private _getOrderedGroups;
    private _getOrderedSystems;
    private _shouldRun;
    private _requireTickPosition;
    private _placeGroupInTick;
}
