import { Vector2 } from '../../math/index.js';
import { UiAxis, UiAxisSizeUnit } from './ui-axis.js';
/**
 * The `x`/`y` axis pair a `UiAnchor` preset produces, spread into
 * `addRectTransformComponent`'s options (e.g. `addRectTransformComponent(world,
 * entity, UiAnchor.topLeft({ x: 200, y: 60 }))`).
 */
export interface UiAnchorConfig {
    x: UiAxis;
    y: UiAxis;
}
/**
 * Options for a `UiAnchor` preset that stretches horizontally (a "band"
 * spanning the parent's full width) but is point-anchored vertically.
 */
export interface UiHorizontalBandOptions {
    /** The band's height, in `heightUnit` - the vertical axis is point-anchored, so this is a literal size. */
    height: number;
    /** Margin added to the band's horizontal span, in reference pixels. Defaults to `0`. */
    horizontalMargin?: number;
    /** The unit `height` is expressed in. Defaults to `'referencePixels'`. See {@link UiAxisSizeUnit}. */
    heightUnit?: UiAxisSizeUnit;
}
/**
 * Options for a `UiAnchor` preset that stretches vertically (a "band"
 * spanning the parent's full height) but is point-anchored horizontally.
 */
export interface UiVerticalBandOptions {
    /** The band's width, in `widthUnit` - the horizontal axis is point-anchored, so this is a literal size. */
    width: number;
    /** Margin added to the band's vertical span, in reference pixels. Defaults to `0`. */
    verticalMargin?: number;
    /** The unit `width` is expressed in. Defaults to `'referencePixels'`. See {@link UiAxisSizeUnit}. */
    widthUnit?: UiAxisSizeUnit;
}
/**
 * Common anchor/pivot presets for `RectTransformEcsComponent`, expressing
 * the "pin to corner/edge/center" and "stretch" cases `resolveRect` supports
 * without hand writing `x`/`y` axis descriptors. Each preset is a factory -
 * call it with the size/margin values that actually apply to *its* axes
 * (a point-anchored axis takes a literal size, a stretch-anchored axis
 * takes a margin - never both for the same axis) and spread the result into
 * `addRectTransformComponent`'s options, e.g.
 * `addRectTransformComponent(world, entity, UiAnchor.topLeft({ x: 200, y: 60 }))`.
 */
export declare const UiAnchor: {
    /** Pins to the parent's top-left corner. `size` sets the element's literal width/height. */
    topLeft: (size?: Vector2) => UiAnchorConfig;
    /** Pins to the parent's top edge, horizontally centered. `size` sets the element's literal width/height. */
    topCenter: (size?: Vector2) => UiAnchorConfig;
    /** Pins to the parent's top-right corner. `size` sets the element's literal width/height. */
    topRight: (size?: Vector2) => UiAnchorConfig;
    /** Pins to the parent's left edge, vertically centered. `size` sets the element's literal width/height. */
    middleLeft: (size?: Vector2) => UiAnchorConfig;
    /** Centers within the parent's rect. `size` sets the element's literal width/height. */
    center: (size?: Vector2) => UiAnchorConfig;
    /** Pins to the parent's right edge, vertically centered. `size` sets the element's literal width/height. */
    middleRight: (size?: Vector2) => UiAnchorConfig;
    /** Pins to the parent's bottom-left corner. `size` sets the element's literal width/height. */
    bottomLeft: (size?: Vector2) => UiAnchorConfig;
    /** Pins to the parent's bottom edge, horizontally centered. `size` sets the element's literal width/height. */
    bottomCenter: (size?: Vector2) => UiAnchorConfig;
    /** Pins to the parent's bottom-right corner. `size` sets the element's literal width/height. */
    bottomRight: (size?: Vector2) => UiAnchorConfig;
    /**
     * A full-width horizontal band pinned to the parent's top edge - the
     * common "HUD top bar" anchor. `height` sets the band's height (it's
     * point-anchored vertically); `horizontalMargin` is a horizontal margin.
     */
    stretchTop: ({ height, horizontalMargin, heightUnit, }: UiHorizontalBandOptions) => UiAnchorConfig;
    /** Stretches to fill the parent's full width, vertically centered. */
    stretchHorizontal: ({ height, horizontalMargin, heightUnit, }: UiHorizontalBandOptions) => UiAnchorConfig;
    /**
     * A full-width horizontal band pinned to the parent's bottom edge - the
     * common "HUD bottom bar" anchor. `height` sets the band's height.
     */
    stretchBottom: ({ height, horizontalMargin, heightUnit, }: UiHorizontalBandOptions) => UiAnchorConfig;
    /**
     * A full-height vertical band pinned to the parent's left edge - the
     * common "side panel" anchor. `width` sets the band's width.
     */
    stretchLeft: ({ width, verticalMargin, widthUnit, }: UiVerticalBandOptions) => UiAnchorConfig;
    /** Stretches to fill the parent's full height, horizontally centered. */
    stretchVertical: ({ width, verticalMargin, widthUnit, }: UiVerticalBandOptions) => UiAnchorConfig;
    /**
     * A full-height vertical band pinned to the parent's right edge.
     * `width` sets the band's width.
     */
    stretchRight: ({ width, verticalMargin, widthUnit, }: UiVerticalBandOptions) => UiAnchorConfig;
    /**
     * Stretches to fill the parent's full rect. A `TextEcsComponent` child
     * anchored this way centers/right-aligns/justifies correctly despite the
     * center pivot: `createUiLayoutEcsSystem` syncs both `maxWidth` and
     * `horizontalAlignPivot` from this rect every frame for any stretch-x
     * anchor, not just left-pivoted ones (see its own doc comment).
     * `margin` is added to both axes' anchored span. Defaults to `{x: 0, y: 0}`.
     */
    stretchAll: (margin?: Vector2) => UiAnchorConfig;
    /**
     * Stretches to fill the parent's full width, vertically centered, with
     * its pivot on the left edge rather than the center - unlike
     * `stretchHorizontal`. A `TextEcsComponent` child centers/right-aligns/
     * justifies correctly under either preset - `createUiLayoutEcsSystem`
     * syncs `horizontalAlignPivot` from whichever pivot the anchor uses, not
     * just a left one (see its own doc comment) - so reach for this preset
     * when you specifically want the rect's own local origin (e.g. for
     * manual position math, or a non-text child) on the left edge rather
     * than the center; it's no longer required just to make text alignment
     * work.
     */
    stretchHorizontalLeft: ({ height, horizontalMargin, heightUnit, }: UiHorizontalBandOptions) => UiAnchorConfig;
    /**
     * A full-width horizontal band pinned to the parent's top edge, like
     * `stretchTop`, but with its pivot on the left edge rather than the
     * center - see `stretchHorizontalLeft`'s own doc comment for what that's
     * useful for. `height` still sets the band's height (point-anchored
     * vertically); `horizontalMargin` is still a horizontal margin.
     */
    stretchTopLeft: ({ height, horizontalMargin, heightUnit, }: UiHorizontalBandOptions) => UiAnchorConfig;
    /**
     * The mirror image of `stretchTopLeft` - a full-width horizontal band
     * pinned to the parent's top edge, with its pivot on the right edge
     * rather than the left or center. Useful for the same reasons
     * `stretchHorizontalLeft`/`stretchTopLeft` are (manual position math, or a
     * non-text child, anchored from the right edge instead) - not for
     * `horizontalAlign`, which works under any pivot on a stretch-x anchor
     * (see `createUiLayoutEcsSystem`'s own doc comment on `horizontalAlignPivot`
     * syncing). `height` still sets the band's height (point-anchored
     * vertically); `horizontalMargin` is still a horizontal margin.
     */
    stretchTopRight: ({ height, horizontalMargin, heightUnit, }: UiHorizontalBandOptions) => UiAnchorConfig;
};
