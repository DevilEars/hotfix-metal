#!/usr/bin/env python3
"""Generates the original pixel art for HOTFIX METAL.

Everything here is drawn from scratch with rectangles: no assets from any
existing game. Re-run with `npm run assets`. Sprites face right and stand on
the bottom edge of their cell (pivot bottom-centre in the engine).
"""
import math
import os
import random

from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'art')
os.makedirs(OUT, exist_ok=True)

# Palette ------------------------------------------------------------------
OUTLINE = (14, 16, 32, 255)
SKIN = (240, 190, 150, 255)
SKIN_D = (205, 150, 115, 255)
HAIR = (40, 30, 50, 255)
BLUE = (30, 110, 230, 255)       # Entelect-style electric blue (approximate)
BLUE_D = (18, 70, 160, 255)
BLUE_L = (90, 160, 255, 255)
LIME = (165, 194, 73, 255)       # accent seen on entelect.co.za
ORANGE = (217, 119, 87, 255)     # Claude coral
ORANGE_D = (160, 80, 55, 255)
JEANS = (45, 52, 88, 255)
JEANS_D = (30, 36, 64, 255)
WHITE = (240, 244, 255, 255)
GREY = (150, 160, 180, 255)
GREY_D = (90, 98, 120, 255)
GREY_DD = (50, 56, 74, 255)
RED = (230, 60, 70, 255)
RED_D = (150, 30, 45, 255)
GREEN = (80, 220, 130, 255)
GREEN_D = (40, 140, 90, 255)
YELLOW = (255, 220, 90, 255)
PURPLE = (150, 90, 220, 255)
PURPLE_D = (90, 50, 150, 255)


def new(w, h, color=(0, 0, 0, 0)):
    img = Image.new('RGBA', (w, h), color)
    return img, ImageDraw.Draw(img)


def rect(d, x0, y0, x1, y1, c):
    d.rectangle([x0, y0, x1, y1], fill=c)


def outline(img, color=OUTLINE):
    """Adds a 1px outline around every opaque shape (4-neighbour)."""
    w, h = img.size
    src = img.load()
    out = img.copy()
    dst = out.load()
    for y in range(h):
        for x in range(w):
            if src[x, y][3] == 0:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and src[nx, ny][3] > 0:
                        dst[x, y] = color
                        break
    return out


def sheet(frames, path, do_outline=True):
    w, h = frames[0].size
    out = Image.new('RGBA', (w * len(frames), h), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        out.paste(outline(f) if do_outline else f, (i * w, 0))
    out.save(os.path.join(OUT, path))


# Player: a developer in a blue hoodie carrying a laptop cannon --------------
def player_frame(kind, t):
    img, d = new(32, 32)
    bob = 1 if (kind == 'idle' and t == 1) else 0
    # legs
    if kind == 'run':
        a = [(0, 0), (2, -1), (0, 0), (-2, -1)][t]
        b = [(0, 0), (-2, -1), (0, 0), (2, -1)][t]
    elif kind == 'jump':
        a, b = (2, -3), (-2, -1)
    else:
        a, b = (0, 0), (0, 0)
    if kind == 'dead':
        rect(d, 6, 24, 24, 29, BLUE)
        rect(d, 2, 22, 8, 28, SKIN)
        rect(d, 3, 21, 8, 23, HAIR)
        rect(d, 22, 25, 28, 29, JEANS)
        rect(d, 10, 15, 22, 24, GREY)
        rect(d, 11, 16, 21, 18, GREEN_D)
        return img
    for off, col in ((b, JEANS_D), (a, JEANS)):
        lx = 13 + off[0]
        ly = 22 + bob
        rect(d, lx, ly, lx + 4, 28 + off[1], col)
        rect(d, lx, 29 + off[1], lx + 6, 30 + off[1], WHITE)
    # torso
    rect(d, 11, 13 + bob, 20, 22 + bob, BLUE)
    rect(d, 11, 20 + bob, 20, 22 + bob, BLUE_D)
    rect(d, 14, 15 + bob, 17, 16 + bob, BLUE_L)          # hoodie drawstrings
    # head
    rect(d, 12, 6 + bob, 19, 12 + bob, SKIN)
    rect(d, 12, 5 + bob, 19, 7 + bob, HAIR)
    rect(d, 11, 6 + bob, 12, 11 + bob, HAIR)
    rect(d, 17, 8 + bob, 18, 9 + bob, OUTLINE)            # eye
    rect(d, 10, 7 + bob, 20, 8 + bob, ORANGE)             # headphone band
    rect(d, 10, 8 + bob, 12, 11 + bob, ORANGE_D)          # ear cup
    # laptop cannon (screen glows green)
    rect(d, 17, 15 + bob, 29, 19 + bob, GREY)
    rect(d, 18, 16 + bob, 28, 17 + bob, GREEN)
    rect(d, 26, 14 + bob, 30, 15 + bob, GREY_D)
    rect(d, 15, 17 + bob, 18, 20 + bob, SKIN)             # hand
    return img


player_frames = [player_frame('idle', 0), player_frame('idle', 1)]
player_frames += [player_frame('run', i) for i in range(4)]
player_frames += [player_frame('jump', 0), player_frame('dead', 0)]
sheet(player_frames, 'player.png')


# Bug: a beetle that crawls along the floor --------------------------------
def bug_frame(t):
    img, d = new(32, 32)
    lift = [0, 1, 0, 1][t]
    body_y = 20 - lift
    rect(d, 7, body_y, 25, body_y + 8, GREEN_D)
    rect(d, 8, body_y - 2, 24, body_y + 6, GREEN)
    rect(d, 10, body_y, 14, body_y + 2, GREEN_D)         # shell spots
    rect(d, 17, body_y + 1, 21, body_y + 3, GREEN_D)
    rect(d, 24, body_y - 1, 29, body_y + 4, RED)          # head
    rect(d, 27, body_y, 28, body_y + 1, WHITE)            # eye
    rect(d, 28, body_y - 4, 29, body_y - 2, GREY)         # antenna
    for i, lx in enumerate((9, 14, 19, 23)):
        o = 1 if (i + t) % 2 else 0
        rect(d, lx, body_y + 7, lx + 1, 29 + o - lift + lift, GREY_D)
    return img


sheet([bug_frame(i) for i in range(4)], 'bug.png')


# Rogue bot: a walking cron job that shoots -------------------------------------
def bot_frame(kind, t):
    img, d = new(32, 32)
    step = (0, 2)[t % 2] if kind == 'walk' else 0
    rect(d, 11 + step, 22, 14 + step, 29, GREY_D)
    rect(d, 17 - step, 22, 20 - step, 29, GREY_D)
    rect(d, 10 + step, 29, 15 + step, 30, GREY_DD)
    rect(d, 16 - step, 29, 21 - step, 30, GREY_DD)
    rect(d, 9, 11, 22, 22, GREY)
    rect(d, 9, 19, 22, 22, GREY_D)
    rect(d, 12, 13, 19, 17, GREY_DD)                     # chest panel
    rect(d, 13, 14, 14, 15, RED)
    rect(d, 17, 14, 18, 15, RED)
    rect(d, 11, 3, 20, 10, GREY)                          # head
    rect(d, 13, 5, 19, 7, RED)                            # visor
    rect(d, 15, 0, 16, 3, GREY_D)                         # antenna
    rect(d, 15, 0, 16, 1, RED)
    rect(d, 22, 14, 30, 17, GREY_DD)                      # blaster
    if kind == 'shoot':
        rect(d, 29, 13, 31, 18, YELLOW)
    return img


sheet([bot_frame('idle', 0), bot_frame('walk', 0), bot_frame('walk', 1),
       bot_frame('shoot', 0)], 'bot.png')


# Heisenbug: a flying moth that vanishes when you look at it ---------------
def fly_frame(t):
    img, d = new(32, 32)
    wing_up = t == 0
    wy = 8 if wing_up else 13
    rect(d, 9, wy, 15, wy + 6, (200, 210, 255, 255))
    rect(d, 17, wy, 23, wy + 6, (200, 210, 255, 255))
    rect(d, 10, wy + 1, 14, wy + 4, (230, 235, 255, 255))
    rect(d, 18, wy + 1, 22, wy + 4, (230, 235, 255, 255))
    rect(d, 12, 14, 20, 24, PURPLE)
    rect(d, 12, 20, 20, 24, PURPLE_D)
    rect(d, 14, 17, 15, 18, YELLOW)
    rect(d, 17, 17, 18, 18, YELLOW)
    rect(d, 15, 25, 16, 27, GREY)
    return img


sheet([fly_frame(0), fly_frame(1)], 'fly.png')


# Merge-conflict turret: a box that shows <<<<<<< ======= >>>>>>> ------------
def turret_frame(firing):
    img, d = new(32, 32)
    rect(d, 4, 14, 27, 30, GREY_D)
    rect(d, 4, 14, 27, 17, GREY)
    rect(d, 6, 19, 25, 27, GREY_DD)
    # three lines of conflict markers: red '<', white '=', green '>'
    for i, (col, mark) in enumerate(((RED, '<'), (WHITE, '='), (GREEN, '>'))):
        y = 20 + i * 3
        for k in range(5):
            x = 8 + k * 3
            if mark == '=':
                rect(d, x, y, x + 1, y, col)
            elif mark == '<':
                d.point((x + 1, y), fill=col)
            else:
                d.point((x, y), fill=col)
    rect(d, 12, 5, 19, 13, GREY)                          # cannon housing
    rect(d, 13, 6, 18, 8, RED if firing else RED_D)
    rect(d, 19, 8, 29, 11, GREY_DD)                       # barrel
    if firing:
        rect(d, 28, 6, 31, 13, YELLOW)
    return img


sheet([turret_frame(False), turret_frame(True)], 'turret.png')


# Junior dev (the hostage): tied up with ethernet cable, then freed -----------
def junior_frame(kind, t):
    img, d = new(32, 32)
    sway = t % 2
    shirt = LIME
    if kind == 'tied':
        rect(d, 12, 24, 19, 30, JEANS)
        rect(d, 11, 14, 20, 24, shirt)
        for y in (16, 19, 22):                            # cable wraps
            rect(d, 11, y, 20, y, ORANGE)
        rect(d, 12, 5 + sway, 19, 12 + sway, SKIN)
        rect(d, 12, 4 + sway, 19, 6 + sway, (120, 70, 40, 255))
        rect(d, 13, 8 + sway, 14, 9 + sway, OUTLINE)
        rect(d, 17, 8 + sway, 18, 9 + sway, OUTLINE)
        rect(d, 14, 11 + sway, 17, 11 + sway, RED_D)      # worried mouth
        rect(d, 21, 3 + sway, 23, 5 + sway, WHITE)        # "help!" bubble dot
    else:
        a = [(0, 0), (2, -1)][t]
        b = [(0, 0), (-2, -1)][t]
        for off, col in ((b, JEANS_D), (a, JEANS)):
            rect(d, 13 + off[0], 22, 17 + off[0], 28 + off[1], col)
            rect(d, 13 + off[0], 29 + off[1], 19 + off[0], 30 + off[1], WHITE)
        rect(d, 11, 13, 20, 22, shirt)
        rect(d, 12, 5, 19, 12, SKIN)
        rect(d, 12, 4, 19, 6, (120, 70, 40, 255))
        rect(d, 17, 8, 18, 9, OUTLINE)
        rect(d, 14, 11, 17, 11, OUTLINE)
        rect(d, 19, 10, 22, 11, SKIN)
        rect(d, 21, 5, 22, 10, SKIN)                      # waving arm
    return img


sheet([junior_frame('tied', 0), junior_frame('tied', 1),
       junior_frame('free', 0), junior_frame('free', 1)], 'junior.png')


# Pickups (16x16): Heavy Commit, Claude Spark, Revert Grenade, Coffee, Points -
def pickup_frame(kind):
    img, d = new(16, 16)
    rect(d, 1, 1, 14, 14, GREY_DD)
    rect(d, 2, 2, 13, 13, GREY_D)
    if kind == 'heavy':                                   # "H"
        rect(d, 4, 4, 5, 11, YELLOW)
        rect(d, 10, 4, 11, 11, YELLOW)
        rect(d, 4, 7, 11, 8, YELLOW)
    elif kind == 'claude':                                # 8-ray spark
        for ang in range(0, 360, 45):
            for r in range(1, 6):
                x = 8 + round(math.cos(math.radians(ang)) * r)
                y = 8 + round(math.sin(math.radians(ang)) * r)
                d.point((x, y), fill=ORANGE)
        rect(d, 7, 7, 8, 8, WHITE)
    elif kind == 'grenade':                               # revert arrow
        rect(d, 5, 5, 10, 6, LIME)
        rect(d, 4, 6, 5, 9, LIME)
        rect(d, 5, 9, 10, 10, LIME)
        rect(d, 9, 3, 10, 8, LIME)
        rect(d, 8, 4, 8, 7, LIME)
    elif kind == 'coffee':
        rect(d, 4, 6, 10, 12, WHITE)
        rect(d, 11, 7, 12, 10, WHITE)
        rect(d, 5, 7, 9, 8, (110, 70, 40, 255))
        rect(d, 5, 3, 5, 5, GREY)
        rect(d, 8, 2, 8, 5, GREY)
    else:                                                 # story points
        rect(d, 5, 3, 10, 12, YELLOW)
        rect(d, 4, 5, 11, 10, YELLOW)
        rect(d, 7, 5, 8, 10, (255, 245, 180, 255))
    return img


sheet([pickup_frame(k) for k in ('heavy', 'claude', 'grenade', 'coffee', 'points')],
      'pickups.png')


# Explosion (32x32, 6 frames) -------------------------------------------------
def explosion_frame(t):
    img, d = new(32, 32)
    r = [4, 9, 13, 15, 14, 11][t]
    cols = [WHITE, YELLOW, (255, 150, 60, 255), (210, 70, 50, 255),
            (110, 50, 60, 255), (60, 40, 50, 255)]
    rnd = random.Random(7 + t)
    for ring, col in zip(range(r, 0, -3), cols[t:] + cols):
        for _ in range(90):
            ang = rnd.random() * math.tau
            rad = rnd.random() * ring
            x = 16 + int(math.cos(ang) * rad)
            y = 17 + int(math.sin(ang) * rad)
            rect(d, x - 1, y - 1, x + 1, y + 1, col)
    if t >= 3:                                            # debris
        for _ in range(8):
            x, y = rnd.randint(4, 27), rnd.randint(4, 27)
            d.point((x, y), fill=GREY)
    return img


sheet([explosion_frame(i) for i in range(6)], 'explosion.png', do_outline=False)


# Boss: THE MONOLITH - a 15-year-old mainframe that nobody dares to touch -----
def boss_frame(state):
    img, d = new(96, 96)
    body = GREY_D if state != 'rage' else (130, 70, 80, 255)
    rect(d, 14, 14, 82, 94, GREY_DD)
    rect(d, 16, 16, 80, 92, body)
    rect(d, 16, 16, 80, 22, GREY)                          # top plate
    # rack slots with blinking LEDs
    for i, y in enumerate(range(28, 84, 9)):
        rect(d, 22, y, 74, y + 5, GREY_DD)
        for k in range(6):
            lit = (i + k + (state != 'idle')) % 3 == 0
            col = RED if state == 'rage' else (GREEN if lit else GREEN_D)
            rect(d, 26 + k * 5, y + 2, 27 + k * 5, y + 3, col)
        rect(d, 54, y + 1, 72, y + 4, (30, 36, 52, 255))
    # the big eye: a CRT that has seen things
    rect(d, 30, 4, 66, 30, GREY_DD)
    rect(d, 33, 7, 63, 27, (20, 40, 36, 255))
    eye = RED if state == 'rage' else GREEN
    rect(d, 40, 12, 56, 22, eye)
    rect(d, 46, 14, 50, 20, (20, 24, 30, 255))
    rect(d, 36, 8, 40, 9, eye)
    rect(d, 56, 8, 60, 9, eye)
    # cable-arms
    rect(d, 2, 40, 14, 46, ORANGE_D)
    rect(d, 0, 46, 8, 70, ORANGE_D)
    rect(d, 82, 40, 94, 46, ORANGE_D)
    rect(d, 88, 46, 96 - 1, 70, ORANGE_D)
    # sticky note: "DO NOT TOUCH"
    rect(d, 60, 50, 74, 62, YELLOW)
    rect(d, 62, 53, 72, 53, OUTLINE)
    rect(d, 62, 56, 70, 56, OUTLINE)
    rect(d, 62, 59, 72, 59, OUTLINE)
    return img


sheet([boss_frame('idle'), boss_frame('open'), boss_frame('rage')], 'boss.png')


# Environment tiles ------------------------------------------------------------
def ground_top():
    img, d = new(16, 16, (24, 30, 52, 255))
    rect(d, 0, 0, 15, 2, LIME)
    rect(d, 0, 3, 15, 3, (110, 140, 50, 255))
    for x in (2, 9):
        rect(d, x, 7, x + 4, 7, (50, 150, 120, 255))
        rect(d, x + 4, 7, x + 4, 11, (50, 150, 120, 255))
        d.point((x + 4, 12), fill=GREEN)
    return img


def ground_fill():
    img, d = new(16, 48, (20, 24, 44, 255))
    rnd = random.Random(3)
    for _ in range(18):
        x, y = rnd.randint(0, 12), rnd.randint(0, 44)
        rect(d, x, y, x + rnd.randint(2, 5), y, (40, 52, 90, 255))
    for y in (15, 31):
        rect(d, 0, y, 15, y, (14, 18, 34, 255))
    return img


def rack_tile():
    img, d = new(16, 16, GREY_DD)
    rect(d, 0, 0, 15, 1, GREY)
    rect(d, 0, 14, 15, 15, (30, 34, 50, 255))
    for k in range(4):
        rect(d, 2, 3 + k * 3, 13, 4 + k * 3, (30, 36, 54, 255))
        d.point((3, 3 + k * 3), fill=GREEN if k % 2 else ORANGE)
        d.point((5, 3 + k * 3), fill=GREEN_D)
    return img


ground_top().save(os.path.join(OUT, 'ground_top.png'))
ground_fill().save(os.path.join(OUT, 'ground_fill.png'))
rack_tile().save(os.path.join(OUT, 'rack.png'))


def billboard():
    img, d = new(160, 56, (12, 18, 40, 255))
    rect(d, 0, 0, 159, 3, BLUE)
    rect(d, 0, 52, 159, 55, BLUE)
    rect(d, 0, 0, 3, 55, BLUE)
    rect(d, 156, 0, 159, 55, BLUE)
    for x in range(8, 152, 12):
        d.point((x, 8), fill=BLUE_L)
        d.point((x, 47), fill=BLUE_L)
    return img


billboard().save(os.path.join(OUT, 'billboard.png'))


# Backdrops -------------------------------------------------------------------
def sky():
    img, d = new(8, 240)
    top, bot = (8, 10, 30), (40, 28, 70)
    for y in range(240):
        t = y / 239
        d.line([(0, y), (7, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)) + (255,))
    img = img.resize((8, 240))
    img.save(os.path.join(OUT, 'sky.png'))


def stars():
    img, d = new(512, 240)
    rnd = random.Random(11)
    for _ in range(90):
        x, y = rnd.randint(0, 511), rnd.randint(0, 150)
        c = rnd.choice([(255, 255, 255, 255), (150, 180, 255, 255), (255, 200, 160, 255)])
        d.point((x, y), fill=c)
    img.save(os.path.join(OUT, 'stars.png'))


def skyline(name, seed, base_y, min_h, max_h, body, window, density):
    img, d = new(512, 240)
    rnd = random.Random(seed)
    x = 0
    while x < 512:
        w = rnd.randint(28, 56)
        w = min(w, 512 - x)
        h = rnd.randint(min_h, max_h)
        top = base_y - h
        rect(d, x, top, x + w - 1, 239, body)
        rect(d, x, top, x + w - 1, top, tuple(min(255, c + 25) for c in body[:3]) + (255,))
        for wy in range(top + 6, base_y - 4, 8):
            for wx in range(x + 4, x + w - 5, 7):
                if rnd.random() < density:
                    rect(d, wx, wy, wx + 2, wy + 3, window)
        if rnd.random() < 0.3:
            rect(d, x + w // 2, top - 10, x + w // 2, top, body)
            d.point((x + w // 2, top - 11), fill=RED)
        x += w + rnd.randint(0, 3)
    img.save(os.path.join(OUT, name))


sky()
stars()
skyline('skyline_far.png', 5, 215, 60, 150, (22, 26, 62, 255), (70, 110, 200, 255), 0.35)
skyline('skyline_near.png', 9, 238, 40, 95, (34, 40, 84, 255), (255, 200, 110, 255), 0.25)

# Brand badges drawn as plain placeholders; swap in official logos under
# public/brand/ (see README).
print('art written to', os.path.abspath(OUT))
