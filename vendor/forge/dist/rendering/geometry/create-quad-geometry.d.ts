import type { RenderContext } from '../render-context.js';
import { Geometry } from './geometry.js';
/**
 * Creates a quad covering clip space (`-1` to `1`), as two triangles, with
 * `a_position` and `a_texCoord` (`0` to `1`) attributes. Draw sprites and
 * full-screen passes with the render context's own
 * `renderContext.quadGeometry` instead of creating another.
 * @param renderContext - The render context to create the quad in.
 * @returns The quad geometry. The caller owns it.
 */
export declare function createQuadGeometry(renderContext: RenderContext): Geometry;
