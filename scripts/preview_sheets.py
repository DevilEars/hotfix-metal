#!/usr/bin/env python3
"""Writes a 4x contact sheet of every sprite sheet for quick art review.

Usage: python3 scripts/preview_sheets.py [out.png] [name ...]
"""
import os
import sys

from PIL import Image

ART = os.path.join(os.path.dirname(__file__), '..', 'public', 'art')
SCALE = 4
BG = (38, 22, 62, 255)

out_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'scratch', 'contact.png')
names = sys.argv[2:] or ['player', 'junior', 'bug', 'fly', 'bot', 'turret', 'boss', 'pickups', 'explosion']

sheets = [Image.open(os.path.join(ART, n + '.png')).convert('RGBA') for n in names]
width = max(s.width for s in sheets) * SCALE
height = sum(s.height * SCALE + 8 for s in sheets)
out = Image.new('RGBA', (width, height), BG)
y = 0
for s in sheets:
    out.alpha_composite(s.resize((s.width * SCALE, s.height * SCALE), Image.NEAREST), (0, y))
    y += s.height * SCALE + 8
os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
out.save(out_path)
print('contact sheet:', os.path.abspath(out_path))
