#!/usr/bin/env python3
"""Builds the environment art from the CC0 Warped City pack (third_party/).

Crops and composes tiles, parallax layers, props and the explosion into the
texture names the game loads from public/art/. Never resamples: everything
stays at 16 px per world unit.
"""
import os

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'third_party', 'warped-city')
OUT = os.path.join(ROOT, 'public', 'art')
os.makedirs(OUT, exist_ok=True)

VIEW_H = 240
TILESET_COLUMNS = 24


def load(*parts):
    return Image.open(os.path.join(SRC, *parts)).convert('RGBA')


def save(img, name):
    img.save(os.path.join(OUT, name + '.png'))


TILESET = load('tileset.png')


def tile(gid):
    """A 16x16 tile by its Tiled gid (1-based, as in the pack's demo map)."""
    index = gid - 1
    x, y = (index % TILESET_COLUMNS) * 16, (index // TILESET_COLUMNS) * 16
    return TILESET.crop((x, y, x + 16, y + 16))


def stack(*tiles):
    out = Image.new('RGBA', (16, 16 * len(tiles)), (0, 0, 0, 0))
    for i, t in enumerate(tiles):
        out.alpha_composite(t, (0, i * 16))
    return out


def repeat_x(img, times):
    out = Image.new('RGBA', (img.width * times, img.height), (0, 0, 0, 0))
    for i in range(times):
        out.alpha_composite(img, (i * img.width, 0))
    return out


HAZE = (26, 12, 52)


def fade(img, amount):
    """Atmospheric depth: blends opaque pixels toward the night haze so the
    backdrop sits behind the characters."""
    out = img.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a:
                px[x, y] = (round(r + (HAZE[0] - r) * amount), round(g + (HAZE[1] - g) * amount),
                            round(b + (HAZE[2] - b) * amount), a)
    return out


def layer(img, bottom_gap):
    """Places a layer on a 240 px tall canvas, its base bottom_gap px above the
    view bottom; the rows below are filled with the layer's bottom row so the
    base never shows a hard edge."""
    out = Image.new('RGBA', (img.width, VIEW_H), (0, 0, 0, 0))
    top = VIEW_H - bottom_gap - img.height
    out.alpha_composite(img, (0, top))
    base = img.crop((0, img.height - 1, img.width, img.height))
    for y in range(VIEW_H - bottom_gap, VIEW_H):
        out.alpha_composite(base, (0, y))
    return out


# Tiles --------------------------------------------------------------------------
LEDGE_L, LEDGE, LEDGE_ALT, LEDGE_R = tile(271), tile(272), tile(273), tile(274)
WALL, WALL_BAND = tile(29), tile(46)

ground_top = WALL.copy()
ground_top.alpha_composite(LEDGE)
save(ground_top, 'ground_top')
save(stack(WALL_BAND, WALL, WALL), 'ground_fill')
save(LEDGE_L, 'rack_l')
save(LEDGE_ALT, 'rack')
save(LEDGE_R, 'rack_r')

# Parallax backdrop ---------------------------------------------------------------
# Far sky (sunset clouds, 128x240) fills the whole view.
skyline_a = load('skyline-a.png')
save(repeat_x(skyline_a, 4), 'stars')
save(skyline_a.crop((0, 0, 8, VIEW_H)), 'sky')

# Mid city silhouettes (144 px wide, tiles seamlessly).
save(fade(layer(repeat_x(load('buildings-bg.png'), 4), 14), 0.25), 'skyline_far')

# Near towers; transparent edges, so it tiles without seams.
save(fade(layer(load('near-buildings-bg.png'), 6), 0.42), 'skyline_near')

# Props (static scenery behind the action) -------------------------------------------
for name, file in {
    'prop_antenna': 'antenna.png',
    'prop_box': 'control-box-1.png',
    'prop_box_wide': 'control-box-3.png',
    'prop_hotel': 'hotel-sign.png',
    'prop_monitor': 'monitor-face-1.png',
    'prop_banner_big': 'banner-big-1.png',
    'prop_banner_side': 'banner-side-1.png',
}.items():
    save(load('props', file), name)

# Explosion: 6 frames of 55x52, centred in 56x56 cells ---------------------------------
CELL = 56
frames = [load('sprites', f'enemy-explosion-{i}.png') for i in range(1, 7)]
strip = Image.new('RGBA', (CELL * len(frames), CELL), (0, 0, 0, 0))
for i, f in enumerate(frames):
    strip.alpha_composite(f, (i * CELL + (CELL - f.width) // 2, (CELL - f.height) // 2))
save(strip, 'explosion')

print('environment art written to', os.path.abspath(OUT))
