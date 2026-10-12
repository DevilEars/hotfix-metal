import { EcsSystem } from '../../ecs/index.js';
import { PositionEcsComponent } from '../../common/index.js';
import { CameraEcsComponent } from '../components/index.js';
import { RenderContext } from '../render-context.js';
/**
 * Creates an ECS system that draws every entity with a
 * `TerrainMeshEcsComponent` (see `addTerrainMeshComponent`) - one
 * non-instanced `gl.drawArrays` call per mesh, against its own geometry and
 * material - rather than going through the sprite pipeline
 * `createRenderEcsSystem` batches (which only knows how to draw quads).
 * Register it *before* `createRenderEcsSystem` so terrain draws underneath
 * sprites.
 *
 * A world can have any number of terrain mesh entities; each is matched
 * against every camera's `cullingMask` (via `TerrainMeshEcsComponent.category`,
 * the same convention `SpriteEcsComponent.category` uses) exactly like
 * a sprite, so different cameras can show different terrain
 * meshes.
 *
 * This system owns clearing each camera's destination for the frame:
 * whenever there's at least one terrain mesh to draw, it sets
 * `renderContext.clearStrategy` to `CLEAR_STRATEGY.none` so
 * `createRenderEcsSystem`'s own clear (which would otherwise wipe the
 * terrain right before drawing sprites on top of it) becomes a no-op, and
 * clears each camera's destination itself instead - callers never need to
 * touch `clearStrategy` themselves. `clearStrategy` is left untouched while
 * no terrain mesh entities exist yet (e.g. before an async-loaded terrain
 * mesh has resolved), so the sprite pipeline keeps clearing normally until
 * there's terrain to draw.
 * @param renderContext - The render context to draw into.
 */
export declare const createTerrainRenderEcsSystem: (renderContext: RenderContext) => EcsSystem<[CameraEcsComponent, PositionEcsComponent]>;
