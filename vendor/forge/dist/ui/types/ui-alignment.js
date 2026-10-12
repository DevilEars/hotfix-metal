/**
 * Common `childAlignment` presets for `UiAxisLayoutGroupEcsComponent`/
 * `GridLayoutGroupEcsComponent`, named the same way as `UiAnchor`'s nine point presets. These are shared, module-level
 * objects - safe to reference directly, since nothing in this module mutates
 * a `childAlignment` value after reading it.
 */
export const uiAlignments = {
    topLeft: { x: 0, y: 1 },
    topCenter: { x: 0.5, y: 1 },
    topRight: { x: 1, y: 1 },
    middleLeft: { x: 0, y: 0.5 },
    center: { x: 0.5, y: 0.5 },
    middleRight: { x: 1, y: 0.5 },
    bottomLeft: { x: 0, y: 0 },
    bottomCenter: { x: 0.5, y: 0 },
    bottomRight: { x: 1, y: 0 },
};
