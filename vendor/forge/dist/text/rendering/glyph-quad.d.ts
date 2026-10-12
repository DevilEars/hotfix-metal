import { PositionEcsComponent, RotationEcsComponent, ScaleEcsComponent } from '../../common/index.js';
import { RenderCommand } from '../../rendering/render-command.js';
import type { InstanceMask } from '../../rendering/utilities/resolve-instance-mask.js';
import type { TextRenderables } from './create-text-renderables.js';
import { TextEcsComponent } from '../components/text-component.js';
import { TextMeshEcsComponent } from '../components/text-mesh-component.js';
/**
 * The transform a text entity's glyphs are placed with.
 */
export interface TextTransform {
    /** The entity's position; each glyph is offset from it. */
    position: PositionEcsComponent;
    /** The entity's rotation, if it has one. */
    rotation: RotationEcsComponent | null;
    /** The entity's scale, if it has one. */
    scale: ScaleEcsComponent | null;
    /** The masks the entity's glyphs are drawn through, or `null` for none. */
    mask: InstanceMask | null;
}
/**
 * Pushes the render commands for every visible glyph in `textMesh`, as two
 * ordered passes: outline/shadow ("effects") first, then fill - see
 * `createTextRenderables`' doc comment for why. The effects pass is skipped
 * entirely when neither an outline nor a shadow is actually configured (the
 * common case), so plain text costs exactly what it did before this split.
 * The render system sorts whole text entities, not glyphs, and draws an
 * entity's commands in the order they're pushed, so every glyph's fill is
 * drawn after every glyph's effects for this entity.
 * @param commands - The render command buffer to push into.
 * @param textComponent - The entity's `TextEcsComponent` (for `color` and its effect fields).
 * @param textMesh - The entity's shaped glyph quads to push commands for.
 * @param renderables - The renderables glyphs draw with (see `createTextRenderables`).
 * @param transform - The entity's position (each glyph is offset from it), rotation and scale.
 * @param pixelRatio - Device pixels per CSS pixel the destination is rendered at (see `RenderContext.pixelRatio`), which the outline/shadow sizes are scaled by (default: 1).
 */
export declare function pushTextRenderCommands(commands: RenderCommand[], textComponent: TextEcsComponent, textMesh: TextMeshEcsComponent, renderables: TextRenderables, transform: TextTransform, pixelRatio?: number): void;
