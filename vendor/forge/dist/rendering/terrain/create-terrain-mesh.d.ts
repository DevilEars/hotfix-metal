import { Vector2 } from '../../math/index.js';
import { Color } from '../color.js';
import { Geometry } from '../geometry/index.js';
import { Material } from '../materials/index.js';
import { RenderContext } from '../render-context.js';
import type { Texture } from '../texture.js';
import type { TerrainCurvePoint } from './terrain-curve.js';
/**
 * Texture and tiling options for one of a terrain mesh's two texture
 * layers (see {@link CreateTerrainMeshOptions}).
 */
export interface TerrainMeshLayerOptions {
    /**
     * The texture to tile across this layer. Create it with
     * `wrap: 'repeat'`, so it tiles instead of stretching its edge texels.
     */
    texture: Texture;
    /**
     * The world-space size of one tile of the texture: x tiles along the
     * curve's arc length, y tiles into the ground. Smaller values repeat the
     * texture more often over the same span of terrain.
     */
    tileSize: Vector2;
    /** Tint multiplied against the sampled texture. */
    tint: Color;
}
/**
 * Fields of {@link CreateTerrainMeshOptions} with a sensible default;
 * callers may omit these.
 */
export interface CreateTerrainMeshDefaultedOptions {
    /**
     * How wide (in world units) the blend between the border and fill layers
     * is, centered on `borderWidth`.
     */
    borderBlend: number;
}
export interface CreateTerrainMeshOptions extends Partial<CreateTerrainMeshDefaultedOptions> {
    /**
     * The dense curve points to build the mesh from - see `buildTerrainCurve`.
     * Pass the same points used to build the corresponding `TerrainCollider` (by
     * mapping each `TerrainCurvePoint.position` into the `Vector2[]`
     * `TerrainCollider` expects), so what's drawn always matches what's touched.
     */
    curvePoints: readonly TerrainCurvePoint[];
    /**
     * How far (in world units) the mesh extends below its lowest curve
     * point. Must match the `depth` passed to the corresponding
     * `TerrainCollider` for the mesh to align with the collision volume.
     */
    depth: number;
    /**
     * The world-space position of the mesh. Must match the world position
     * of the corresponding `TerrainCollider`'s entity. The mesh's vertices
     * are baked into world space, so the mesh doesn't follow the entity.
     */
    position: Vector2;
    /**
     * The world-space rotation of the mesh, in radians. Must match the world
     * rotation of the corresponding `TerrainCollider`'s entity.
     */
    angle: number;
    /** The texture tiled across the terrain's surface, from the surface down to `borderWidth`. */
    border: TerrainMeshLayerOptions;
    /** The texture tiled across the terrain's interior, below `borderWidth`. */
    fill: TerrainMeshLayerOptions;
    /**
     * How deep (in world units) the border layer extends below the surface
     * before blending into the fill layer.
     */
    borderWidth: number;
}
/**
 * The static terrain mesh built by {@link createTerrainMesh}, ready to draw
 * with `createTerrainRenderEcsSystem`.
 */
export interface TerrainMesh {
    readonly geometry: Geometry;
    readonly material: Material;
    readonly vertexCount: number;
}
/**
 * Builds a single triangulated mesh visualizing a `TerrainCollider`'s
 * heightmap, textured with a tileable "border" layer near the surface
 * blending into a tileable "fill" layer below it (see
 * `CreateTerrainMeshOptions`). Since the mesh has an arbitrary vertex count
 * - not the fixed six-vertices-per-quad the sprite pipeline batches - draw
 * it with `createTerrainRenderEcsSystem` rather than through
 * `createRenderEcsSystem`.
 * @param renderContext - The render context used to build the mesh's geometry and material.
 * @param options - Sizing and texturing options for the mesh.
 * @throws An error if a layer's texture doesn't have `wrap: 'repeat'`.
 * @returns The built `TerrainMesh`.
 */
export declare function createTerrainMesh(renderContext: RenderContext, options: CreateTerrainMeshOptions): TerrainMesh;
