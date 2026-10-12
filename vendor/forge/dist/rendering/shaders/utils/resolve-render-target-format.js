import { RENDER_TARGET_FORMAT, } from '../../enums/index.js';
/**
 * Resolves the color texture format a `RenderTarget` should actually
 * allocate, falling back to `RENDER_TARGET_FORMAT.ldr` when
 * `RENDER_TARGET_FORMAT.hdr` was requested but the context doesn't support
 * `EXT_color_buffer_float` (required to render into a half-float texture;
 * see `RenderContext.supportsHdrRenderTargets`).
 * @param renderContext - The render context the target belongs to.
 * @param requested - The format the caller asked for.
 * @returns The format to actually allocate.
 */
export function resolveRenderTargetFormat(renderContext, requested) {
    if (requested === RENDER_TARGET_FORMAT.ldr) {
        return requested;
    }
    return renderContext.supportsHdrRenderTargets
        ? RENDER_TARGET_FORMAT.hdr
        : RENDER_TARGET_FORMAT.ldr;
}
