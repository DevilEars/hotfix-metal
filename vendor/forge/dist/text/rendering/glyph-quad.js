import { Vec2 } from '../../math/index.js';
/**
 * Builds the glyph-centered position offset from `entityPosition` shared by
 * a glyph's effects and fill commands.
 * @param entityPosition - The text entity's position.
 * @param glyph - The glyph to offset from it.
 * @returns The glyph's own position.
 */
function buildGlyphPosition(entityPosition, glyph) {
    return {
        local: entityPosition.local,
        world: Vec2.add(Vec2.clone(entityPosition.world), glyph.offset),
    };
}
/**
 * Pushes one `RenderCommand` per visible glyph in `textMesh` for the
 * outline/shadow ("effects") pass, generalizing the sub-quad expansion
 * `render-system.ts`'s `pushSpriteRenderCommands` already does for
 * nine-slice sprites: each `GlyphQuad` is wrapped in a synthetic
 * `SpriteEcsComponent`-shaped object (centered via `pivot: (0.5, 0.5)`) so
 * glyphs reuse the exact same `bindSpriteInstanceData`/
 * `setupSpriteInstanceAttributes` machinery sprites and nine-slice regions
 * already batch through.
 * @param commands - The render command buffer to push into.
 * @param textComponent - The entity's `TextEcsComponent` (for its effect fields).
 * @param textMesh - The entity's shaped glyph quads to push commands for.
 * @param renderables - The renderables glyphs draw with (see `createTextRenderables`).
 * @param transform - The entity's position (each glyph is offset from it), rotation and scale.
 * @param pixelRatio - Device pixels per CSS pixel the destination is rendered at (see `RenderContext.pixelRatio`).
 */
function pushTextEffectsRenderCommands(commands, textComponent, textMesh, renderables, transform, pixelRatio) {
    const { effectsRenderable } = renderables;
    const { layer, category, fontAtlas, outlineColor, outlineWidth, shadowColor, shadowOffset, shadowSoftness, } = textComponent;
    const { position: entityPosition, rotation, scale, mask } = transform;
    // Uniform across every glyph in this entity, so built once rather than
    // per glyph. The effect sizes are authored in CSS pixels but the shader
    // measures them in the destination's own (device) pixels, so they're
    // scaled up by the pixel ratio to keep the same physical size on a HiDPI
    // display as on a standard one.
    const textEffects = {
        outlineColor,
        outlineWidth: outlineWidth * pixelRatio,
        shadowColor,
        shadowOffset: Vec2.multiply(Vec2.clone(shadowOffset), pixelRatio),
        shadowSoftness: shadowSoftness * pixelRatio,
    };
    for (const glyph of textMesh.glyphs) {
        const glyphSprite = {
            width: glyph.size.x,
            height: glyph.size.y,
            pivot: { x: 0.5, y: 0.5 },
            uvOffset: glyph.uvOffset,
            uvScale: glyph.uvScale,
            // `msdf-effects.frag` doesn't read `v_tint` at all - the ring/shadow
            // colors it actually draws with come from `textEffects` below - but
            // `SpriteEcsComponent.tintColor` still has to be a `Color`.
            tintColor: outlineColor,
            texture: fontAtlas.texture,
            emissive: null,
            material: null,
            category,
            layer,
        };
        commands.push({
            renderable: effectsRenderable,
            texture: fontAtlas.texture,
            emissiveTexture: null,
            fontAtlas,
            components: {
                position: buildGlyphPosition(entityPosition, glyph),
                rotation,
                scale,
                sprite: glyphSprite,
                flip: null,
                mask,
                textEffects,
                textEmbolden: glyph.embolden,
            },
        });
    }
}
/**
 * Pushes one `RenderCommand` per visible glyph in `textMesh` for the fill
 * pass, always after every glyph's effects commands for the same text
 * entity (see `pushTextRenderCommands`) so a glyph's fill can never be
 * painted over by a neighboring glyph's outline/shadow.
 * @param commands - The render command buffer to push into.
 * @param textComponent - The entity's `TextEcsComponent` (for `color`, for glyphs outside a `<color>` tag).
 * @param textMesh - The entity's shaped glyph quads to push commands for.
 * @param renderables - The renderables glyphs draw with (see `createTextRenderables`).
 * @param transform - The entity's position (each glyph is offset from it), rotation and scale.
 */
function pushTextFillRenderCommands(commands, textComponent, textMesh, renderables, transform) {
    const { fillRenderable } = renderables;
    const { layer, category, fontAtlas, color } = textComponent;
    const { position: entityPosition, rotation, scale, mask } = transform;
    for (const glyph of textMesh.glyphs) {
        const glyphSprite = {
            width: glyph.size.x,
            height: glyph.size.y,
            pivot: { x: 0.5, y: 0.5 },
            uvOffset: glyph.uvOffset,
            uvScale: glyph.uvScale,
            tintColor: glyph.color ?? color,
            opacityMultiplier: textComponent.opacityMultiplier,
            texture: fontAtlas.texture,
            emissive: null,
            material: null,
            category,
            layer,
        };
        commands.push({
            renderable: fillRenderable,
            texture: fontAtlas.texture,
            emissiveTexture: null,
            fontAtlas,
            components: {
                position: buildGlyphPosition(entityPosition, glyph),
                rotation,
                scale,
                sprite: glyphSprite,
                flip: null,
                mask,
                textEmbolden: glyph.embolden,
            },
        });
    }
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
export function pushTextRenderCommands(commands, textComponent, textMesh, renderables, transform, pixelRatio = 1) {
    const { outlineWidth, shadowColor } = textComponent;
    const hasEffects = outlineWidth > 0 || shadowColor.a > 0;
    if (hasEffects) {
        pushTextEffectsRenderCommands(commands, textComponent, textMesh, renderables, transform, pixelRatio);
    }
    pushTextFillRenderCommands(commands, textComponent, textMesh, renderables, transform);
}
