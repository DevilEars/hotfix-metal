import { EcsWorld } from '../../ecs/ecs-world.js';
import { Rect, Vector2 } from '../../math/index.js';
/**
 * A linear or radial mask, as the shader tests it: a fragment's world
 * position is turned into mask coordinates, `-1` to `1` across the mask's
 * rect on each axis, by `axes * (world - origin)`.
 */
interface InstanceShapeMaskFrame {
    /** The center of the mask's rect, in world space. */
    origin: Vector2;
    /**
     * The rows of the 2x2 matrix from a world offset to mask coordinates:
     * `x = xx * dx + xy * dy`, `y = yx * dx + yy * dy`.
     */
    axes: {
        xx: number;
        xy: number;
        yx: number;
        yy: number;
    };
}
/**
 * A linear mask. Its axes are turned so the edge it reveals from is always
 * mask coordinate `x = -1`; `edge` is how far the revealed part reaches.
 */
export interface InstanceLinearMask extends InstanceShapeMaskFrame {
    kind: 'linear';
    edge: number;
}
/**
 * A radial mask: the sector from `startAngle` through `filledSweep`
 * (`sweep * amount`), with angles measured in the rect's own units, which
 * are `aspect` (width over height) times wider than mask coordinates.
 */
export interface InstanceRadialMask extends InstanceShapeMaskFrame {
    kind: 'radial';
    startAngle: number;
    filledSweep: number;
    aspect: number;
}
/** The single linear or radial mask an instance is drawn through. */
export type InstanceShapeMask = InstanceLinearMask | InstanceRadialMask;
/**
 * Every mask an instance is drawn through, combined: the intersection of
 * its rect masks, and at most one linear or radial mask.
 */
export interface InstanceMask {
    /**
     * Whether any of the instance can show. `false` when a mask has no area
     * (a zero size or scale, `amount: 0`) or the rect masks don't overlap.
     */
    visible: boolean;
    /** The intersection of the world-space bounds of every rect mask. */
    clip: Rect;
    /**
     * `clip` intersected with the shape mask's world-space bounds: nothing
     * outside it shows, so instances outside it needn't be drawn.
     */
    bounds: Rect;
    /** The linear or radial mask, or `null` for none. */
    shape: InstanceShapeMask | null;
}
/**
 * Returns the masks an entity's sprites and text are drawn through, or
 * `null` when no mask applies.
 */
export type InstanceMaskResolver = (entity: number) => InstanceMask | null;
/**
 * Creates a function that finds the masks (see `MaskEcsComponent`) an
 * entity's sprites and text are drawn through: the entity's own mask and
 * those of its ancestors. Each entity is resolved once per resolver, so the
 * render system creates one per frame. When the world has no masks, it
 * returns `null` for every entity without walking the hierarchy.
 * @param world - The world the entities belong to.
 * @returns The resolver.
 * @throws From the resolver: an error if two linear or radial masks apply
 * to one entity, or a mask's entity has no position.
 */
export declare function createInstanceMaskResolver(world: EcsWorld): InstanceMaskResolver;
export {};
