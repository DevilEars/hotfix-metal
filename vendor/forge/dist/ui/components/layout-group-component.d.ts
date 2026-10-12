import { EcsWorld } from '../../ecs/ecs-world.js';
import { Vector2 } from '../../math/index.js';
import { UiAlignment } from '../types/ui-alignment.js';
/**
 * Inset, in reference pixels, between a layout group's own resolved rect and
 * the content box its children are measured/arranged within.
 */
export interface UiLayoutGroupPadding {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
/**
 * Fields of a horizontal or vertical `UiAxisLayoutGroupEcsComponent`,
 * with a sensible default; callers may omit these.
 */
export interface UiAxisLayoutGroupDefaultedOptions {
    /** Inset between this group's rect and the content box its children fill. */
    padding: UiLayoutGroupPadding;
    /** Gap, in reference pixels, between adjacent children along the main axis. */
    spacing: number;
    /**
     * Where children (as a block, along the main axis; individually, along
     * the cross axis) sit within any leftover space after their own sizes and
     * spacing are subtracted from the content box. See `uiAlignments` for
     * presets.
     */
    childAlignment: UiAlignment;
    /**
     * Whether this group resizes each child's width - to its measured
     * preferred size, plus a share of any leftover horizontal space if
     * `childForceExpandWidth` is also set. `false` leaves a child's own
     * width untouched; the group still positions it.
     */
    childControlWidth: boolean;
    /** The height equivalent of `childControlWidth`. */
    childControlHeight: boolean;
    /**
     * With `childControlWidth` also set: on the main axis (a horizontal
     * group's width), distributes any leftover space - content box width
     * minus the sum of every child's own preferred width and inter-child
     * spacing - across children, weighted by each child's
     * `LayoutElementEcsComponent.flexibleWidth` (or evenly, if none of them
     * set one). On the cross axis (a vertical group's width), simply
     * stretches every child to the content box's full width, ignoring its
     * own preferred width entirely.
     */
    childForceExpandWidth: boolean;
    /** The height equivalent of `childForceExpandWidth` (main axis for a vertical group, cross axis for a horizontal one). */
    childForceExpandHeight: boolean;
}
/**
 * ECS-style component interface for a horizontal or vertical layout group -
 * `direction` is set by `addHorizontalLayoutGroupComponent`/
 * `addVerticalLayoutGroupComponent` and picks which axis
 * `createUiLayoutGroupEcsSystem` treats as the "main" (arranged, spaced)
 * axis versus the "cross" (aligned) axis.
 */
export interface UiAxisLayoutGroupEcsComponent extends UiAxisLayoutGroupDefaultedOptions {
    readonly direction: 'horizontal' | 'vertical';
}
export declare const uiAxisLayoutGroupId: import("../../ecs/ecs-component.js").ComponentKey<UiAxisLayoutGroupEcsComponent>;
/**
 * Attaches a horizontal `UiAxisLayoutGroupEcsComponent` (arranging
 * children left-to-right) to `entity`. `createUiLayoutGroupEcsSystem`
 * arranges every direct child that has a `RectTransformEcsComponent` and
 * whose `LayoutElementEcsComponent.ignoreLayout` (if present) isn't `true`
 * and that isn't hidden by its own `VisibilityEcsComponent`, along the
 * entity's own content box (its resolved rect, inset by `padding`) - each
 * child's height is the group's cross axis, sized/aligned per
 * `childControlHeight`/`childAlignment.y`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to. Its own
 * `RectTransformEcsComponent` supplies the group's content box - add one
 * first if `entity` doesn't already have one (e.g. via `createPanel`).
 * @param options - Options for configuring the group.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addHorizontalLayoutGroupComponent(world: EcsWorld, entity: number, options?: Partial<UiAxisLayoutGroupDefaultedOptions>): UiAxisLayoutGroupEcsComponent;
/**
 * Attaches a vertical `UiAxisLayoutGroupEcsComponent` (arranging
 * children top-to-bottom) to `entity`. Otherwise identical to
 * {@link addHorizontalLayoutGroupComponent}, with the main/cross axes
 * swapped - width is the cross axis, sized/aligned per
 * `childControlWidth`/`childAlignment.x`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to. Its own
 * `RectTransformEcsComponent` supplies the group's content box - add one
 * first if `entity` doesn't already have one (e.g. via `createPanel`).
 * @param options - Options for configuring the group.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addVerticalLayoutGroupComponent(world: EcsWorld, entity: number, options?: Partial<UiAxisLayoutGroupDefaultedOptions>): UiAxisLayoutGroupEcsComponent;
/** Which corner a `GridLayoutGroupEcsComponent` starts placing cells from. */
export type UiGridLayoutGroupCorner = 'upperLeft' | 'upperRight' | 'lowerLeft' | 'lowerRight';
/** Which axis a `GridLayoutGroupEcsComponent` fills first before wrapping. */
export type UiGridLayoutGroupAxis = 'horizontal' | 'vertical';
/**
 * How a `GridLayoutGroupEcsComponent` sizes one axis's columns/rows: `'fixed'`
 * uses `cellSize` for every column/row, unchanged from the grid's original
 * behavior; `'content'` derives each column's width (or row's height) from
 * the largest measured preferred size among the cells that land in it - the
 * same way an HTML `<table>` auto-sizes its columns.
 */
export type UiGridSizingMode = 'fixed' | 'content';
/**
 * Fields of {@link GridLayoutGroupEcsComponent} shared by every `constraint`,
 * each with a sensible default; callers may omit these.
 */
export interface GridLayoutGroupCommonDefaultedOptions {
    /** Inset between this group's rect and the content box its cells fill. */
    padding: UiLayoutGroupPadding;
    /**
     * Every cell's fixed size - unlike an axis layout group, a grid never
     * measures its children; each simply occupies one `cellSize`-sized cell.
     */
    cellSize: Vector2;
    /** Gap, in reference pixels, between adjacent cells on each axis. */
    spacing: Vector2;
    /** Where the whole grid block sits within any leftover content-box space. */
    childAlignment: UiAlignment;
    /** Which corner cell index `0` starts from. */
    startCorner: UiGridLayoutGroupCorner;
    /** Which axis is filled first (columns, then wrapping to a new row, or vice versa). */
    startAxis: UiGridLayoutGroupAxis;
    /**
     * The fixed column (or row) count when `constraint` is
     * `fixedColumnCount`/`fixedRowCount`. Unused for `flexible`.
     */
    constraintCount: number;
    /**
     * Where a cell's own content sits within its column/row when that axis's
     * `columnWidthMode`/`rowHeightMode` is `'content'` and this specific cell
     * is narrower/shorter than the shared column/row size. No effect on a
     * `'fixed'` axis, where a cell always fills `cellSize` exactly. Defaults
     * to `uiAlignments.topLeft`.
     */
    cellAlignment: UiAlignment;
}
/**
 * How a `GridLayoutGroupEcsComponent` decides its column/row count, and
 * which per-axis sizing modes are valid for that choice - `columnWidthMode`/
 * `rowHeightMode: 'content'` derives that axis's column/row size from its
 * cells' own measured preferred size (see `UiGridSizingMode`), which only
 * makes sense once the column/row count itself is already fixed: a flexible
 * grid's column count depends on column width, which would depend on column
 * count. Modeled as a discriminated union on `constraint` rather than two
 * independent fields, so passing `columnWidthMode`/`rowHeightMode: 'content'`
 * alongside `constraint: 'flexible'` (or its default) is a compile-time type
 * error instead of a thrown one.
 */
export type UiGridLayoutGroupConstraintFields = {
    constraint?: 'flexible';
    columnWidthMode?: 'fixed';
    rowHeightMode?: 'fixed';
} | {
    constraint: 'fixedColumnCount' | 'fixedRowCount';
    /** Defaults to `'fixed'`. */
    columnWidthMode?: UiGridSizingMode;
    /** The height/row equivalent of `columnWidthMode`. Defaults to `'fixed'`. */
    rowHeightMode?: UiGridSizingMode;
};
/**
 * The fully-resolved (every field defaulted) equivalent of
 * {@link UiGridLayoutGroupConstraintFields}. Kept as its own named union
 * (rather than derived from it with `Pick`) since `Pick` over a union
 * collapses each field into a single flattened union instead of preserving
 * which `columnWidthMode`/`rowHeightMode` values actually pair with which
 * `constraint`.
 */
export type ResolvedGridLayoutGroupConstraintFields = {
    constraint: 'flexible';
    columnWidthMode: 'fixed';
    rowHeightMode: 'fixed';
} | {
    constraint: 'fixedColumnCount' | 'fixedRowCount';
    columnWidthMode: UiGridSizingMode;
    rowHeightMode: UiGridSizingMode;
};
export type GridLayoutGroupEcsComponent = GridLayoutGroupCommonDefaultedOptions & ResolvedGridLayoutGroupConstraintFields;
export declare const gridLayoutGroupId: import("../../ecs/ecs-component.js").ComponentKey<GridLayoutGroupEcsComponent>;
/**
 * Attaches a {@link GridLayoutGroupEcsComponent} to `entity`, arranging every
 * direct child that has a `RectTransformEcsComponent` and whose
 * `LayoutElementEcsComponent.ignoreLayout` (if present) isn't `true` and
 * that isn't hidden by its own `VisibilityEcsComponent` into a cell grid
 * within the entity's own content box (its resolved rect, inset by
 * `padding`). Unlike the axis groups, cell size never comes from a child's
 * own measured size on a `'fixed'` axis (the default for both
 * `columnWidthMode`/`rowHeightMode`) - every cell on that axis is exactly
 * `cellSize`. Setting either to `'content'` instead derives that axis's
 * column/row size from its cells' own measured preferred size - see
 * {@link UiGridLayoutGroupConstraintFields}'s doc comment.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to. Its own
 * `RectTransformEcsComponent` supplies the group's content box - add one
 * first if `entity` doesn't already have one (e.g. via `createPanel`).
 * @param options - Options for configuring the grid. `columnWidthMode`/
 * `rowHeightMode: 'content'` is only available once `constraint` is
 * `'fixedColumnCount'`/`'fixedRowCount'`, enforced at compile time.
 * @returns The attached component, for further tuning or runtime changes.
 */
export declare function addGridLayoutGroupComponent(world: EcsWorld, entity: number, options?: Partial<GridLayoutGroupCommonDefaultedOptions> & UiGridLayoutGroupConstraintFields): GridLayoutGroupEcsComponent;
