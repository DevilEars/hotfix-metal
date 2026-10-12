import { flipId, positionId, rotationId, scaleId, } from '../../common/index.js';
import { clamp, Rects } from '../../math/index.js';
import { maskId, } from '../components/mask-component.js';
const unmaskedResolver = () => null;
const hiddenMask = () => ({
    visible: false,
    clip: Rects.zero,
    bounds: Rects.zero,
    shape: null,
});
const intersectRects = (a, b) => ({
    min: { x: Math.max(a.min.x, b.min.x), y: Math.max(a.min.y, b.min.y) },
    max: { x: Math.min(a.max.x, b.max.x), y: Math.min(a.max.y, b.max.y) },
});
const isEmptyRect = (rect) => rect.min.x >= rect.max.x || rect.min.y >= rect.max.y;
const infiniteRect = () => ({
    min: { x: -Infinity, y: -Infinity },
    max: { x: Infinity, y: Infinity },
});
/**
 * Turns a linear mask's axes so its origin edge lands on `x = -1`. The
 * mask's rect is the square `-1` to `1` in mask coordinates, so turning or
 * mirroring them leaves the rect where it is.
 */
const linearAxesByOrigin = {
    left: (axes) => axes,
    right: ({ xx, xy, yx, yy }) => ({ xx: -xx, xy: -xy, yx, yy }),
    bottom: ({ xx, xy, yx, yy }) => ({ xx: yx, xy: yy, yx: xx, yy: xy }),
    top: ({ xx, xy, yx, yy }) => ({ xx: -yx, xy: -yy, yx: xx, yy: xy }),
};
/**
 * Combines `inherited` (the masks above `entity`) with `entity`'s own mask.
 */
function applyMask(inherited, entity, mask, accessors) {
    if (inherited && !inherited.visible) {
        return inherited;
    }
    const position = accessors.getPosition(entity);
    if (!position) {
        throw new Error(`Entity ${entity} has a mask but no position; a mask is placed by its entity's position.`);
    }
    const flip = accessors.getFlip(entity);
    const scale = accessors.getScale(entity);
    const radians = accessors.getRotation(entity)?.world ?? 0;
    const scaleX = (scale?.world.x ?? 1) * (flip?.flipX ? -1 : 1);
    const scaleY = (scale?.world.y ?? 1) * (flip?.flipY ? -1 : 1);
    const halfWidth = (mask.width * scaleX) / 2;
    const halfHeight = (mask.height * scaleY) / 2;
    if (halfWidth === 0 || halfHeight === 0) {
        return hiddenMask();
    }
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    // The rect's center relative to the entity's position, before rotation.
    const centerX = (0.5 - mask.pivot.x) * mask.width * scaleX;
    const centerY = (0.5 - mask.pivot.y) * mask.height * scaleY;
    const origin = {
        x: position.world.x + centerX * cos - centerY * sin,
        y: position.world.y + centerX * sin + centerY * cos,
    };
    const extentX = Math.abs(halfWidth * cos) + Math.abs(halfHeight * sin);
    const extentY = Math.abs(halfWidth * sin) + Math.abs(halfHeight * cos);
    const maskBounds = {
        min: { x: origin.x - extentX, y: origin.y - extentY },
        max: { x: origin.x + extentX, y: origin.y + extentY },
    };
    const clip = inherited?.clip ?? infiniteRect();
    const bounds = inherited?.bounds ?? infiniteRect();
    const { shape } = mask;
    if (shape.kind === 'rect') {
        const maskedClip = intersectRects(clip, maskBounds);
        const maskedBounds = intersectRects(bounds, maskBounds);
        if (isEmptyRect(maskedBounds)) {
            return hiddenMask();
        }
        return {
            visible: true,
            clip: maskedClip,
            bounds: maskedBounds,
            shape: inherited?.shape ?? null,
        };
    }
    if (inherited?.shape) {
        throw new Error(`Entity ${entity} has a ${shape.kind} mask inside another linear or radial mask; content can be clipped by at most one linear or radial mask.`);
    }
    const amount = clamp(shape.amount, 0, 1);
    const maskedBounds = intersectRects(bounds, maskBounds);
    if (amount === 0 || isEmptyRect(maskedBounds)) {
        return hiddenMask();
    }
    // World offset -> mask coordinates: undo the rotation, then divide by the
    // (scaled, flipped) half size.
    const axes = {
        xx: cos / halfWidth,
        xy: sin / halfWidth,
        yx: -sin / halfHeight,
        yy: cos / halfHeight,
    };
    if (shape.kind === 'linear') {
        return {
            visible: true,
            clip,
            bounds: maskedBounds,
            shape: {
                kind: 'linear',
                origin,
                axes: linearAxesByOrigin[shape.origin](axes),
                // Fully revealed reaches past the rect's far edge, so that edge is
                // anti-aliased once, by the rect, rather than twice.
                edge: amount === 1 ? 2 : amount * 2 - 1,
            },
        };
    }
    return {
        visible: true,
        clip,
        bounds: maskedBounds,
        shape: {
            kind: 'radial',
            origin,
            axes,
            startAngle: shape.startAngle,
            filledSweep: shape.sweep * amount,
            aspect: mask.width / mask.height,
        },
    };
}
/**
 * Creates a function that finds the masks (see `MaskEcsComponent`) an
 * entity's sprites and text are drawn through: the entity's own mask and
 * those of its ancestors. Each entity is resolved once per resolver, so the
 * render system creates one per frame. When the world has no masks, it
 * returns `null` for every entity without walking the hierarchy.
 * @param world - The world the entities belong to.
 * @returns The resolver.
 * @throws From the resolver: an error if two linear or radial masks apply
 * to one entity, or a mask's entity has no position.
 */
export function createInstanceMaskResolver(world) {
    if (world.query([maskId]).entities.length === 0) {
        return unmaskedResolver;
    }
    const accessors = {
        getMask: world.getComponentAccessor(maskId),
        getPosition: world.getComponentAccessor(positionId),
        getRotation: world.getComponentAccessor(rotationId),
        getScale: world.getComponentAccessor(scaleId),
        getFlip: world.getComponentAccessor(flipId),
    };
    const resolved = new Map();
    const resolve = (entity) => {
        const cached = resolved.get(entity);
        if (cached !== undefined) {
            return cached;
        }
        const parent = world.getParent(entity);
        const inherited = parent === null ? null : resolve(parent);
        const mask = accessors.getMask(entity);
        const result = mask
            ? applyMask(inherited, entity, mask, accessors)
            : inherited;
        resolved.set(entity, result);
        return result;
    };
    return resolve;
}
