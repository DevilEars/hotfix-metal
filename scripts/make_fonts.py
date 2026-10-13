#!/usr/bin/env python3
"""Converts the CC0 Kenney pixel fonts into Forge font atlases.

Forge only renders MSDF atlases (msdf-atlas-gen JSON layout). Pixel fonts are
rasterised exactly at 8x their native 8 px em, a signed distance field is
computed per glyph and copied into all three channels (the shader takes the
median, so an SDF is a valid MSDF), and the glyphs are shelf-packed.
Also copies the TTFs to src/fonts/ for the HTML screens (src/styles.css).
"""
import json
import os
import shutil

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import distance_transform_edt

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'third_party', 'kenney-fonts')
OUT = os.path.join(ROOT, 'public', 'fonts')
CSS_FONTS = os.path.join(ROOT, 'src', 'fonts')
os.makedirs(OUT, exist_ok=True)
os.makedirs(CSS_FONTS, exist_ok=True)

NATIVE_EM = 8               # every Kenney pixel font is drawn on an 8 px em
SCALE = 8                   # atlas pixels per font pixel
EM = NATIVE_EM * SCALE      # rasterise size: one font pixel = an 8x8 block
RANGE = 16                  # distanceRange in atlas pixels (2 font pixels)
PAD = RANGE // 2 + 2
ATLAS_W = 1024

FONTS = {
    'pixel-display': 'Kenney Pixel Square.ttf',
    'pixel-body': 'Kenney Mini Square.ttf',
}
HTML_ONLY = []


def signed_distance(mask):
    inside = distance_transform_edt(mask)
    outside = distance_transform_edt(~mask)
    sd = np.where(mask, inside - 0.5, -(outside - 0.5))
    return np.clip(0.5 + sd / RANGE, 0, 1)


def build(name, file):
    font = ImageFont.truetype(os.path.join(SRC, file), EM)
    ascent, descent = font.getmetrics()
    cells = []
    for cp in range(32, 127):
        ch = chr(cp)
        advance = font.getlength(ch) / EM
        box = font.getbbox(ch, anchor='ls')
        if box[2] <= box[0] or box[3] <= box[1]:
            cells.append((cp, advance, None, None))
            continue
        l, t, r, b = box
        w, h = r - l + 2 * PAD, b - t + 2 * PAD
        img = Image.new('L', (w, h), 0)
        draw = ImageDraw.Draw(img)
        draw.fontmode = '1'
        draw.text((PAD - l, PAD - t), ch, font=font, fill=255, anchor='ls')
        sdf = signed_distance(np.array(img) > 127)
        plane = {'left': (l - PAD) / EM, 'top': -(t - PAD) / EM, 'right': (r + PAD) / EM, 'bottom': -(b + PAD) / EM}
        cells.append((cp, advance, plane, sdf))

    # Shelf packing, tallest first.
    order = sorted([c for c in cells if c[3] is not None], key=lambda c: -c[3].shape[0])
    x = y = shelf = 0
    placed = {}
    for cp, _, _, sdf in order:
        h, w = sdf.shape
        if x + w > ATLAS_W:
            x, y, shelf = 0, y + shelf + 1, 0
        placed[cp] = (x, y)
        x += w + 1
        shelf = max(shelf, h)
    atlas_h = 1 << (y + shelf).bit_length()
    atlas = np.zeros((atlas_h, ATLAS_W), dtype=np.float64)

    glyphs = []
    for cp, advance, plane, sdf in cells:
        entry = {'codePoint': cp, 'advance': advance, 'planeBounds': None, 'atlasBounds': None}
        if sdf is not None:
            px, py = placed[cp]
            h, w = sdf.shape
            atlas[py:py + h, px:px + w] = sdf
            entry['planeBounds'] = plane
            # y-up, normalised: 1 is the top row of the image.
            entry['atlasBounds'] = {'left': px / ATLAS_W, 'top': 1 - py / atlas_h,
                                    'right': (px + w) / ATLAS_W, 'bottom': 1 - (py + h) / atlas_h}
        glyphs.append(entry)

    cap_box = font.getbbox('H', anchor='ls')
    data = {
        'formatVersion': 2,
        'type': 'msdf',
        'atlasSize': {'width': ATLAS_W, 'height': atlas_h},
        'distanceRange': RANGE,
        'metrics': {
            'lineHeight': (ascent + descent) / EM,
            'ascender': ascent / EM,
            'descender': -descent / EM,
            'capHeight': -cap_box[1] / EM,
        },
        'glyphs': glyphs,
        'kerning': {},
    }
    channel = (atlas * 255).round().astype(np.uint8)
    Image.fromarray(np.stack([channel] * 3, axis=-1), 'RGB').save(os.path.join(OUT, name + '.png'))
    with open(os.path.join(OUT, name + '.json'), 'w') as f:
        json.dump(data, f, indent=1)
    print(f'{name}: {len(glyphs)} glyphs, atlas {ATLAS_W}x{atlas_h}, cap height {data["metrics"]["capHeight"] * NATIVE_EM:.0f} px')


for name, file in FONTS.items():
    build(name, file)
for file in list(FONTS.values()) + HTML_ONLY:
    shutil.copy(os.path.join(SRC, file), os.path.join(CSS_FONTS, file.replace(' ', '-').lower()))
