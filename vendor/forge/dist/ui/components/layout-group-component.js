import { createComponentId } from '../../ecs/ecs-component.js';
import { Vec2 } from '../../math/index.js';
import { uiAlignments } from '../types/ui-alignment.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const zeroPadding = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
};
/**
 * Clones a padding value. `zeroPadding` and every `UiAlignment` preset are
 * shared, module-level objects - cloning keeps one entity's group from
 * mutating another's (or a shared preset's) padding/alignment in place.
 */
function clonePadding(padding) {
    return { ...padding };
}
export const uiAxisLayoutGroupId = createComponentId('uiAxisLayoutGroup');
const defaultUiAxisLayoutGroupOptions = {
    padding: zeroPadding,
    spacing: 0,
    childAlignment: uiAlignments.topLeft,
    childControlWidth: true,
    childControlHeight: true,
    childForceExpandWidth: true,
    childForceExpandHeight: true,
};
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
export function addHorizontalLayoutGroupComponent(world, entity, options = {}) {
    const merged = withDefaults(defaultUiAxisLayoutGroupOptions, options);
    const component = {
        ...merged,
        padding: clonePadding(merged.padding),
        childAlignment: Vec2.clone(merged.childAlignment),
        direction: 'horizontal',
    };
    return world.addComponent(entity, uiAxisLayoutGroupId, component);
}
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
export function addVerticalLayoutGroupComponent(world, entity, options = {}) {
    const merged = withDefaults(defaultUiAxisLayoutGroupOptions, options);
    const component = {
        ...merged,
        padding: clonePadding(merged.padding),
        childAlignment: Vec2.clone(merged.childAlignment),
        direction: 'vertical',
    };
    return world.addComponent(entity, uiAxisLayoutGroupId, component);
}
export const gridLayoutGroupId = createComponentId('gridLayoutGroup');
const defaultGridLayoutGroupCommonOptions = {
    padding: zeroPadding,
    cellSize: { x: 100, y: 100 },
    spacing: Vec2.zero,
    childAlignment: uiAlignments.topLeft,
    startCorner: 'upperLeft',
    startAxis: 'horizontal',
    constraintCount: 1,
    cellAlignment: uiAlignments.topLeft,
};
/** Narrows `options` to its fixed-count-constraint branch, so `columnWidthMode`/`rowHeightMode` read as `UiGridSizingMode` rather than the `'fixed'`-only type the `'flexible'` branch allows. */
function hasFixedGridCountConstraint(options) {
    return (options.constraint === 'fixedColumnCount' ||
        options.constraint === 'fixedRowCount');
}
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
export function addGridLayoutGroupComponent(world, entity, options = {}) {
    // Narrowed to the non-discriminated common fields before spreading, so
    // this merge doesn't collapse `options`'s own `UiGridLayoutGroupConstraintFields`
    // union into a single flat (and therefore wrong) shape.
    const commonOptions = options;
    const common = withDefaults(defaultGridLayoutGroupCommonOptions, commonOptions);
    const constraintFields = hasFixedGridCountConstraint(options)
        ? {
            constraint: options.constraint,
            columnWidthMode: options.columnWidthMode ?? 'fixed',
            rowHeightMode: options.rowHeightMode ?? 'fixed',
        }
        : {
            constraint: 'flexible',
            columnWidthMode: options.columnWidthMode ?? 'fixed',
            rowHeightMode: options.rowHeightMode ?? 'fixed',
        };
    const component = {
        ...common,
        ...constraintFields,
        padding: clonePadding(common.padding),
        cellSize: Vec2.clone(common.cellSize),
        spacing: Vec2.clone(common.spacing),
        childAlignment: Vec2.clone(common.childAlignment),
        cellAlignment: Vec2.clone(common.cellAlignment),
    };
    return world.addComponent(entity, gridLayoutGroupId, component);
}
