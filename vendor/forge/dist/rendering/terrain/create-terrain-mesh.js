import { Vec2 } from '../../math/index.js';
import { Geometry } from '../geometry/index.js';
import { Material } from '../materials/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const defaultCreateTerrainMeshOptions = {
    borderBlend: 12,
};
function buildTerrainMeshData(curvePoints, bottomY, angle, position) {
    const positions = [];
    const distances = [];
    const depths = [];
    const pushVertex = (localPoint, distance, depth) => {
        // Clone before rotating: `localPoint` may be reused for multiple
        // vertices (e.g. a curve point shared between adjacent triangles, or a
        // shared bottom corner within the same quad).
        const world = Vec2.add(Vec2.rotate(Vec2.clone(localPoint), angle), position);
        // Y is negated here to match the sprite pipeline's world-to-render
        // convention (see sprite-instance-data-segment.ts's
        // bindSpriteInstanceData, which negates position.world.y the same way
        // before it reaches the GPU).
        positions.push(world.x, -world.y);
        distances.push(distance);
        depths.push(depth);
    };
    for (let i = 0; i < curvePoints.length - 1; i++) {
        const left = curvePoints[i];
        const right = curvePoints[i + 1];
        const bottomLeft = { x: left.position.x, y: bottomY };
        const bottomRight = { x: right.position.x, y: bottomY };
        const depthLeft = left.position.y - bottomY;
        const depthRight = right.position.y - bottomY;
        pushVertex(left.position, left.distance, 0);
        pushVertex(right.position, right.distance, 0);
        pushVertex(bottomLeft, left.distance, depthLeft);
        pushVertex(right.position, right.distance, 0);
        pushVertex(bottomRight, right.distance, depthRight);
        pushVertex(bottomLeft, left.distance, depthLeft);
    }
    return {
        positions: new Float32Array(positions),
        distances: new Float32Array(distances),
        depths: new Float32Array(depths),
        vertexCount: positions.length / 2,
    };
}
function createTerrainGeometry(renderContext, meshData) {
    return new Geometry(renderContext, [
        { name: 'a_position', data: meshData.positions, size: 2 },
        { name: 'a_distance', data: meshData.distances, size: 1 },
        { name: 'a_depth', data: meshData.depths, size: 1 },
    ]);
}
function assertRepeatingTexture(layer, texture) {
    if (texture.wrap !== 'repeat') {
        throw new Error(`createTerrainMesh tiles its ${layer} texture across the terrain, so it must be created with wrap: 'repeat' (it has wrap: '${texture.wrap}').`);
    }
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
export function createTerrainMesh(renderContext, options) {
    const { curvePoints, depth, position, angle, border, fill, borderWidth } = options;
    const { borderBlend } = withDefaults(defaultCreateTerrainMeshOptions, options);
    const { shaderCache } = renderContext;
    const bottomY = Math.min(...curvePoints.map((curvePoint) => curvePoint.position.y)) - depth;
    const meshData = buildTerrainMeshData(curvePoints, bottomY, angle, position);
    const geometry = createTerrainGeometry(renderContext, meshData);
    assertRepeatingTexture('fill', fill.texture);
    assertRepeatingTexture('border', border.texture);
    const material = new Material(renderContext, shaderCache.getShader('terrain.vert'), shaderCache.getShader('terrain.frag'));
    material.setUniform('u_fillTexture', fill.texture);
    material.setUniform('u_borderTexture', border.texture);
    material.setVectorUniform('u_fillTileSize', fill.tileSize);
    material.setVectorUniform('u_borderTileSize', border.tileSize);
    material.setColorUniform('u_fillTint', fill.tint);
    material.setColorUniform('u_borderTint', border.tint);
    material.setUniform('u_borderWidth', borderWidth);
    material.setUniform('u_borderBlend', borderBlend);
    return { geometry, material, vertexCount: meshData.vertexCount };
}
