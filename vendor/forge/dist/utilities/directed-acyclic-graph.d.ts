/**
 * A directed acyclic graph (DAG) of unique nodes (by reference equality)
 * connected by "must run before" edges.
 * - `addEdge(from, to)` declares that `from` must be ordered before `to`.
 * - `topologicalSort()` returns every node in an order that respects every
 *   edge; nodes with no ordering constraint between them keep their
 *   relative insertion order (a stable sort).
 * - Adding an edge that would create a cycle throws instead of silently
 *   producing an unusable graph.
 */
export declare class DirectedAcyclicGraph<T> {
    private readonly _nodes;
    private readonly _edges;
    private readonly _insertionOrder;
    private readonly _nodeLabel;
    private _insertionCounter;
    private _cache;
    /**
     * Create a new, empty DirectedAcyclicGraph.
     * @param nodeLabel - Formats a node for error messages (e.g. when a cycle
     * or a reference to an unknown node is detected). Defaults to `String(node)`.
     */
    constructor(nodeLabel?: (node: T) => string);
    /** Number of nodes in the graph. */
    get size(): number;
    /**
     * Adds a node to the graph. Adding a node that's already present is a no-op.
     * @param node - The node to add (unique by reference).
     */
    addNode(node: T): void;
    /**
     * Declares that `from` must be ordered before `to`. Adding the same edge
     * twice is a no-op.
     * @param from - The node that must come first. Must already be in the graph.
     * @param to - The node that must come after `from`. Must already be in the graph.
     * @throws An error if either node hasn't been added yet, if `from` and
     * `to` are the same node, or if the edge would create a cycle.
     */
    addEdge(from: T, to: T): void;
    /**
     * Removes a node and every edge connected to it. Removing a node that
     * isn't in the graph is a no-op.
     * @param node - The node to remove.
     */
    removeNode(node: T): void;
    /**
     * @param node - The node to check.
     * @returns Whether `node` has been added to the graph.
     */
    has(node: T): boolean;
    /**
     * @returns Every node in an order that respects every declared edge, with
     * nodes that have no ordering constraint between them kept in insertion order.
     */
    topologicalSort(): T[];
    private _requireNode;
    /**
     * Kahn's algorithm: repeatedly picks the earliest-inserted node with no
     * remaining incoming edges. Returns `null` if a cycle prevents every node
     * from being ordered.
     */
    private _computeOrder;
    /** Depth-first search for a cycle reachable from `start`, used to build a descriptive error message. */
    private _findCycleThrough;
    private _invalidateCache;
    private _getCache;
}
export default DirectedAcyclicGraph;
