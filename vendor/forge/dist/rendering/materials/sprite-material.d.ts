import type { RenderContext } from '../render-context.js';
import type { Texture } from '../texture.js';
import { Material } from './material.js';
import { UniformValue } from './uniform-value.js';
/** The sampler a sprite's `texture` is bound to. */
export declare const spriteTextureUniformName = "u_texture";
/** The sampler a sprite's emissive map is bound to. */
export declare const spriteEmissiveTextureUniformName = "u_emissiveTexture";
/**
 * The shader include every sprite fragment shader applies masks with: its
 * `spriteMaskCoverage()` is how much of the fragment the sprite's masks let
 * through.
 */
export declare const spriteMaskShaderIncludeName = "spriteMask";
/**
 * A material that draws sprites: `sprite.vert`, which positions each
 * sprite's quad from its instance data, paired with a fragment shader. Give
 * one to `SpriteEcsComponent.material` to draw a sprite with a custom
 * fragment shader; sprites without one use `renderContext.spriteMaterial`.
 *
 * The render system binds each sprite's `texture` to `u_texture` and its
 * emissive map (or `renderContext.blackTexture`) to `u_emissiveTexture`,
 * if the fragment shader declares them, so sprites with different textures
 * share one material. Those two uniforms can't be set on the material.
 *
 * The fragment shader must include `spriteMask`
 * (`#pragma forge include(spriteMask)`) and multiply its output alpha by
 * `spriteMaskCoverage()`, so the sprite is clipped by the masks above it
 * (see `MaskEcsComponent`).
 */
export declare class SpriteMaterial extends Material {
    private readonly _declaresTexture;
    private readonly _declaresEmissiveTexture;
    /**
     * Constructs a new instance of the `SpriteMaterial` class.
     * @param renderContext - The render context to draw with.
     * @param fragmentShaderName - The name of the fragment shader in
     * `renderContext.shaderCache`, from its `#pragma forge name(...)`.
     * @throws An error under the same conditions as `Material`'s constructor,
     * if the shader cache has no shader called `fragmentShaderName`, or if
     * that shader doesn't include `spriteMask`.
     */
    constructor(renderContext: RenderContext, fragmentShaderName: string);
    /**
     * Sets a uniform's value, as {@link Material.setUniform} does.
     * @param name - The uniform's name.
     * @param value - The value to upload.
     * @throws An error for `u_texture` and `u_emissiveTexture`, which the
     * render system sets from each sprite, and under the same conditions as
     * {@link Material.setUniform}.
     */
    setUniform(name: string, value: UniformValue): void;
    /**
     * Binds the material to draw sprites with `texture` and `emissiveTexture`.
     * Called by the render system for each batch.
     * @param gl - The WebGL2 rendering context.
     * @param texture - The sprites' texture, bound to `u_texture`.
     * @param emissiveTexture - The sprites' emissive map, bound to
     * `u_emissiveTexture`.
     * @returns The first texture unit the material left free.
     */
    bindSprites(gl: WebGL2RenderingContext, texture: Texture, emissiveTexture: Texture): number;
}
/**
 * Creates a material that draws sprites with a custom fragment shader,
 * paired with `sprite.vert`. The shader receives `v_texCoord` (the sprite's
 * frame UVs), `v_tint` (its tint, with `opacityMultiplier` in alpha) and
 * `v_emissive` (its emissive color), and can declare `u_texture` and
 * `u_emissiveTexture` to sample the sprite's texture and emissive map. It
 * must include `spriteMask` and multiply its output alpha by
 * `spriteMaskCoverage()`. Declare and set any other uniforms it needs on
 * the returned material.
 * @param renderContext - The render context to draw with.
 * @param fragmentShaderName - The name of the fragment shader, registered
 * in `renderContext.shaderCache`.
 * @returns The material. Materials from the same shader share one program.
 * @throws An error if the fragment shader doesn't include `spriteMask`, and
 * under the same conditions as `SpriteMaterial`'s constructor.
 */
export declare function createSpriteMaterial(renderContext: RenderContext, fragmentShaderName: string): SpriteMaterial;
