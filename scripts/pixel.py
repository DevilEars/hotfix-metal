"""Tiny pixel-art toolkit for HOTFIX METAL's procedural sprites.

Shapes are drawn as masks, then shaded with a 4-tone ramp lit from the top
left, composited back to front with a one-step contact shadow, and finished
with a selective (colour-tinted) outline. That is what lifts code-drawn
sprites from flat rectangles to something closer to hand-pixelled art.
"""
import math

from PIL import Image, ImageDraw

INK = (22, 10, 38)  # outline base: deep purple, matches the Warped City palette


def rgb(hex_value):
    n = int(hex_value.lstrip('#'), 16)
    return ((n >> 16) & 255, (n >> 8) & 255, n & 255)


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def ramp(base):
    """[shadow, dark, mid, light] with hue-shifted shadows (toward purple) and
    lights (toward warm white)."""
    base = rgb(base) if isinstance(base, str) else base
    shadow = mix(base, (40, 16, 72), 0.55)
    dark = mix(base, (52, 30, 96), 0.28)
    light = mix(base, (255, 248, 220), 0.38)
    return [shadow, dark, base, light]


class Sprite:
    """An RGBA cell drawn in parts. Later parts draw in front."""

    def __init__(self, w, h):
        self.w, self.h = w, h
        self.px = {}  # (x, y) -> (r, g, b)

    # --- parts -----------------------------------------------------------------
    def part(self, draw_fn, colors, shade=True, contact=True):
        """draw_fn(ImageDraw) paints white onto a mask; the mask is shaded with
        the ramp `colors` and composited in front of what is already there."""
        mask = Image.new('L', (self.w, self.h), 0)
        draw_fn(ImageDraw.Draw(mask))
        pixels = {(x, y) for y in range(self.h) for x in range(self.w) if mask.getpixel((x, y)) > 127}
        self.fill(pixels, colors, shade, contact)
        return pixels

    def fill(self, pixels, colors, shade=True, contact=True):
        pixels = set(pixels)
        if contact:
            # Contact shadow: what this part covers casts one step of shade
            # on the existing pixels just below/right of it.
            for (x, y) in pixels:
                for d in ((1, 1), (0, 1), (1, 0)):
                    q = (x + d[0], y + d[1])
                    if q in self.px and q not in pixels:
                        self.px[q] = mix(self.px[q], INK, 0.28)
        for p in pixels:
            self.px[p] = shade_at(p, pixels, colors) if shade else (colors if isinstance(colors, tuple) else colors[2])

    def dot(self, x, y, color):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.px[(x, y)] = color

    def dots(self, points, color):
        for (x, y) in points:
            self.dot(x, y, color)

    def hline(self, x0, x1, y, color):
        for x in range(x0, x1 + 1):
            self.dot(x, y, color)

    def vline(self, x, y0, y1, color):
        for y in range(y0, y1 + 1):
            self.dot(x, y, color)

    def erase(self, x, y):
        self.px.pop((x, y), None)

    # --- output ------------------------------------------------------------------
    def image(self, outline=True):
        img = Image.new('RGBA', (self.w, self.h), (0, 0, 0, 0))
        for (x, y), c in self.px.items():
            if 0 <= x < self.w and 0 <= y < self.h:
                img.putpixel((x, y), c + (255,))
        if outline:
            img = selective_outline(img)
        return img


def shade_at(p, pixels, colors):
    """Rim light on top/left edges, shadow on bottom/right edges, a soft core
    shadow in the lower-right half of thicker shapes."""
    shadow, dark, mid, light = colors
    x, y = p
    up = (x, y - 1) in pixels
    left = (x - 1, y) in pixels
    down = (x, y + 1) in pixels
    right = (x + 1, y) in pixels
    down2 = (x, y + 2) in pixels
    right2 = (x + 2, y) in pixels
    if not down or not right:
        return shadow if (not down and not right) else dark
    if not up or not left:
        return light
    if not down2 or not right2:
        return dark
    return mid


def selective_outline(img):
    """1 px outline whose colour is a dark version of the neighbouring pixel."""
    w, h = img.size
    src = img.load()
    out = img.copy()
    dst = out.load()
    for y in range(h):
        for x in range(w):
            if src[x, y][3]:
                continue
            for dx, dy in ((0, 1), (1, 0), (-1, 0), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and src[nx, ny][3]:
                    dst[x, y] = mix(src[nx, ny][:3], INK, 0.78) + (255,)
                    break
    return out


# --- shape helpers (all take an ImageDraw on a mask) -------------------------------
def rect(x0, y0, x1, y1):
    return lambda d: d.rectangle([x0, y0, x1, y1], fill=255)


def rrect(x0, y0, x1, y1, r=2):
    return lambda d: d.rounded_rectangle([x0, y0, x1, y1], radius=r, fill=255)


def ellipse(x0, y0, x1, y1):
    return lambda d: d.ellipse([x0, y0, x1, y1], fill=255)


def poly(points):
    return lambda d: d.polygon(points, fill=255)


def limb(points, width):
    """A thick polyline with rounded joints (arms, legs, cables)."""
    def draw(d):
        d.line(points, fill=255, width=width, joint='curve')
        r = (width - 1) / 2
        for (x, y) in points:
            d.ellipse([x - r, y - r, x + r, y + r], fill=255)
    return draw


def union(*fns):
    def draw(d):
        for fn in fns:
            fn(d)
    return draw


def polar(origin, length, degrees):
    """End point of a segment; 0 deg points down, positive swings forward (+x)."""
    a = math.radians(degrees)
    return (origin[0] + math.sin(a) * length, origin[1] + math.cos(a) * length)


def strip(frames, outline=True):
    """Horizontal sprite sheet from a list of Sprite or Image frames."""
    imgs = [f.image(outline) if isinstance(f, Sprite) else f for f in frames]
    w, h = imgs[0].size
    out = Image.new('RGBA', (w * len(imgs), h), (0, 0, 0, 0))
    for i, im in enumerate(imgs):
        out.alpha_composite(im, (i * w, 0))
    return out
