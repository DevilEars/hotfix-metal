#!/usr/bin/env python3
"""Draws HOTFIX METAL's original character art.

The cast (dev hero, juniors, bugs, bots, heisenbugs, the merge-conflict
turret, the mainframe boss, pickups) is drawn from scratch in code with
scripts/pixel.py: shaded parts, posed limbs and selective outlines. The
environment comes from the CC0 Warped City pack (scripts/import_env.py).

Sprites face right and stand on the bottom row of their cell (pivot
bottom-centre in the engine). Re-run with `npm run assets`.
"""
import math
import os

from PIL import Image, ImageDraw

from pixel import INK, Sprite, selective_outline, ellipse, limb, mix, poly, polar, ramp, rect, rgb, rrect, strip, union

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'art')
os.makedirs(OUT, exist_ok=True)


def save(img, name):
    img.save(os.path.join(OUT, name))


# Palette ------------------------------------------------------------------------------
ENTELECT_BLUE = ramp('#1e6fe0')
LIME = ramp('#a5c249')
CORAL = ramp('#d97757')          # Claude coral
SKIN = ramp('#f2bf98')
HAIR = ramp('#4a3157')
HAIR_BROWN = ramp('#8a5634')
DENIM = ramp('#3d4c86')
KHAKI = ramp('#6b6a8c')
SHOE = ramp('#dcdcec')
METAL = ramp('#8e98ba')
GUNMETAL = ramp('#4a5070')
DARK = ramp('#2c2a48')
RED = ramp('#ec4a5c')
GREEN = ramp('#58d68a')
TEAL = ramp('#2fb8c8')
PURPLE = ramp('#9858d8')
WING = ramp('#cbd2ff')
YELLOW = ramp('#ffd25a')

WHITE = (250, 248, 240)
EYE = (34, 18, 48)
GLOW_GREEN = (150, 255, 170)
GLOW_GREEN_HI = (225, 255, 225)
GLOW_RED = (255, 90, 100)
GLOW_RED_HI = (255, 210, 200)
FLASH = (255, 246, 190)
FLASH_HOT = (255, 190, 80)


def darker(colors, t=0.3):
    """The same ramp pushed into shade (far-side limbs)."""
    return [mix(c, INK, t) for c in colors]


# --- Humans: the dev hero and the junior devs ---------------------------------------------
HERO = dict(top=ENTELECT_BLUE, legs=DENIM, hair=HAIR, phones=True)
JUNIOR = dict(top=LIME, legs=KHAKI, hair=HAIR_BROWN, phones=False)

THIGH, SHIN = 4, 5


def leg(s, hip, thigh_deg, knee_deg, colors, ground=47):
    knee = polar(hip, THIGH, thigh_deg)
    ankle = polar(knee, SHIN, thigh_deg - knee_deg)
    ankle = (ankle[0], min(ankle[1], ground - 2))
    s.part(limb([hip, knee, ankle], 4), colors)
    ax, ay = round(ankle[0]), round(ankle[1])
    s.part(rrect(ax - 2, ay, ax + 3, ay + 2, 1), SHOE if colors[2] != darker(SHOE)[2] else darker(SHOE))
    s.hline(ax - 2, ax + 3, ay + 2, mix(SHOE[0], INK, 0.4))


def head(s, x, y, look, dead=False):
    """Head with the face looking right; (x, y) is the top-left of the skull."""
    s.part(ellipse(x + 1, y + 1, x + 11, y + 11), SKIN)
    s.part(union(ellipse(x, y - 1, x + 10, y + 5), rect(x, y + 2, x + 4, y + 8),
                 poly([(x + 2, y), (x + 5, y - 3), (x + 6, y)]),
                 poly([(x + 6, y - 1), (x + 10, y - 2), (x + 9, y + 2)]),
                 poly([(x + 7, y + 2), (x + 11, y + 3), (x + 9, y + 5)])), look['hair'])
    s.dots([(x + 3, y + 1), (x + 4, y)], look['hair'][3])  # shine
    if dead:
        for d in (0, 1):
            s.dot(x + 7 + d, y + 6 + d, EYE)
            s.dot(x + 8 - d, y + 6 + d, EYE)
    else:
        s.vline(x + 8, y + 6, y + 7, EYE)
        s.dot(x + 8, y + 6, WHITE)
        s.hline(x + 7, x + 9, y + 5, look['hair'][0])        # brow
        s.dot(x + 10, y + 8, SKIN[1])                       # nose shadow
        s.hline(x + 7, x + 8, y + 10, SKIN[0])              # mouth
    if look['phones']:
        s.part(limb([(x + 3, y + 5), (x + 3, y), (x + 5, y - 2), (x + 8, y - 2)], 2), darker(CORAL, 0.15), contact=False)
        s.part(rrect(x + 2, y + 4, x + 5, y + 8, 1), CORAL)
        s.dot(x + 3, y + 5, CORAL[3])


def cannon(s, x, y, kick=0):
    """The commit cannon: grip at (x, y). Barrel tip near x + 19."""
    x -= kick
    s.part(rrect(x - 3, y - 3, x + 13, y + 1, 1), METAL)            # body
    s.part(rect(x + 13, y - 2, x + 19, y - 1), GUNMETAL)            # barrel
    s.part(rect(x + 5, y + 1, x + 7, y + 4), GUNMETAL)              # magazine
    s.part(rect(x - 6, y - 2, x - 2, y), GUNMETAL)                  # stock
    s.hline(x, x + 8, y - 2, GLOW_GREEN)                            # status screen
    s.dot(x + 1, y - 2, GLOW_GREEN_HI)
    s.hline(x - 2, x + 12, y - 3, METAL[3])
    s.dot(x + 18, y - 2, GUNMETAL[3])


def dev(look, pose='idle', t=0, gun=True):
    s = Sprite(48, 48)
    bob, hip_y, lean = 0, 36, 0
    legs = {'idle': ((6, 0), (-5, 0)), 'jump': ((55, 95), (-15, 45))}
    if pose == 'idle':
        bob = 1 if t in (1, 2) else 0
        (a1, k1), (a2, k2) = legs['idle']
    elif pose == 'run':
        phase = t / 8 * math.tau
        bob = 1 if t % 4 in (0, 1) else 0
        a1, a2 = 34 * math.sin(phase), 34 * math.sin(phase + math.pi)
        k1 = 12 + 55 * max(0.0, math.cos(phase))
        k2 = 12 + 55 * max(0.0, math.cos(phase + math.pi))
    elif pose == 'jump':
        bob = -1 - t
        (a1, k1), (a2, k2) = legs['jump']
    elif pose == 'crouch':
        bob, lean = 7, 1
    hip = (23, hip_y + bob)
    top = hip_y - 9 + bob              # torso top
    if pose == 'crouch':
        hip = (23, 43)
        s.part(limb([hip, (19, 45), (17, 45)], 4), darker(look['legs']))
        s.part(rrect(14, 44, 18, 46, 1), darker(SHOE))
        s.part(limb([hip, (28, 42), (29, 45)], 4), look['legs'])
        s.part(rrect(27, 44, 33, 46, 1), SHOE)
        s.hline(27, 33, 47, mix(SHOE[0], INK, 0.4))
    else:
        leg(s, hip, a2, k2, darker(look['legs']))
    # far arm reaches for the foregrip
    if gun:
        s.part(limb([(21 + lean, top + 2), (28 + lean, top + 6), (34 + lean, top + 5)], 3), darker(look['top']))
    else:
        s.part(limb([(21, top + 2), (19, top + 6), (20, top + 9)], 3), darker(look['top']))
    if pose != 'crouch':
        leg(s, hip, a1, k1, look['legs'])
    # torso: hoodie or shirt with a hood bump behind the neck
    s.part(union(rrect(18 + lean, top, 28 + lean, top + 10, 3), ellipse(16 + lean, top - 2, 22 + lean, top + 3)), look['top'])
    s.hline(19 + lean, 27 + lean, top + 9, look['top'][0])
    if look['phones']:
        s.vline(24 + lean, top + 2, top + 4, WHITE)   # drawstrings
        s.vline(26 + lean, top + 2, top + 3, WHITE)
    else:
        s.vline(25 + lean, top + 1, top + 5, CORAL[2])  # lanyard
        s.part(rect(24 + lean, top + 5, 26 + lean, top + 7), [WHITE] * 4)
    head(s, 18 + lean, top - 11, look)
    if gun:
        cannon(s, 27 + lean, top + 5)
        s.part(limb([(23 + lean, top + 2), (24 + lean, top + 6), (27 + lean, top + 5)], 3), look['top'])
        s.part(rect(27 + lean, top + 4, 28 + lean, top + 5), SKIN)
        s.part(rect(34 + lean, top + 4, 35 + lean, top + 5), darker(SKIN, 0.2))
    else:
        s.part(limb([(24, top + 2), (27, top + 6), (28, top + 9)], 3), look['top'])
    return s


def rotated(sprite, degrees):
    """Rotates the un-outlined sprite (fall poses), then re-centres it on the
    cell's bottom edge so nothing is clipped."""
    big = Image.new('RGBA', (96, 96), (0, 0, 0, 0))
    big.alpha_composite(sprite.image(outline=False), (24, 24))
    big = big.rotate(degrees, resample=Image.NEAREST)
    x0, y0, x1, y1 = big.getbbox()
    dx, dy = 24 - (x0 + x1) // 2, 46 - y1
    out = Sprite(48, 48)
    for y in range(y0, y1):
        for x in range(x0, x1):
            p = big.getpixel((x, y))
            if p[3]:
                out.dot(x + dx, y + dy + 1, p[:3])
    return out


hero = []
hero += [dev(HERO, 'idle', t) for t in range(4)]       # 0-3 idle
hero += [dev(HERO, 'run', t) for t in range(8)]        # 4-11 run
hero += [dev(HERO, 'jump', t) for t in range(2)]       # 12-13 jump
hero += [dev(HERO, 'crouch')]                          # 14 crouch
hero += [rotated(dev(HERO, 'jump', 0, gun=False), 28), rotated(dev(HERO, 'idle', 0, gun=False), 90)]  # 15-16 dead
save(strip(hero), 'player.png')


def junior_tied(t):
    s = Sprite(48, 48)
    sway = (0, 1, 1, 0)[t]
    top = 27
    leg(s, (23, 36), -4, 0, darker(KHAKI))
    leg(s, (23, 36), 4, 0, KHAKI)
    s.part(union(rrect(18, top, 28, top + 10, 3), ellipse(16, top - 2, 22, top + 3)), LIME)
    s.hline(19, 27, top + 9, LIME[0])
    # ethernet cable wrapped round the arms
    for y in (top + 3, top + 6):
        s.part(limb([(17, y), (29, y + 1)], 2), CORAL, contact=False)
    s.part(rect(28, top + 6, 30, top + 8), [rgb('#f4f4f4')] * 4)  # RJ45 plug
    head(s, 18 + sway, top - 11, JUNIOR)
    s.dots([(28 + sway, top - 8), (28 + sway, top - 7)], WHITE if t % 2 else rgb('#9fd8ff'))  # sweat
    if t >= 2:  # "!" bubble
        s.part(rrect(31, 11, 37, 18, 2), [WHITE] * 4, contact=False)
        s.vline(34, 12, 15, RED[2])
        s.dot(34, 17, RED[2])
    return s


def junior_free(t):
    s = dev(JUNIOR, 'run', t * 2, gun=False)
    wave = (0, 2, 0, 2)[t]
    top = 27 + (1 if (t * 2) % 4 in (0, 1) else 0)
    s.part(limb([(25, top + 2), (29, top - 2), (30 - wave // 2, top - 7)], 3), LIME)
    s.part(rect(29 - wave // 2, top - 9, 31 - wave // 2, top - 7), SKIN)
    return s


save(strip([junior_tied(t) for t in range(4)] + [junior_free(t) for t in range(4)]), 'junior.png')


# --- Bug: a beetle with a </> on its shell -------------------------------------------
def bug(t):
    s = Sprite(32, 32)
    lift = (0, 1, 0, 0, 1, 0)[t]
    by = 18 - lift
    swing = (-2, 0, 2, 2, 0, -2)
    for i, lx in enumerate((10, 15, 20)):               # far legs
        sw = swing[(t + i * 2 + 3) % 6]
        s.part(limb([(lx, by + 6), (lx + sw - 2, by + 9), (lx + sw - 1, 30)], 1), darker(GREEN, 0.6))
    s.part(ellipse(5, by, 23, by + 9), GREEN)
    s.part(ellipse(20, by + 2, 28, by + 9), RED)          # head
    s.dots([(25, by + 5), (26, by + 5)], WHITE)
    s.dot(26, by + 6, EYE)
    s.part(limb([(24, by + 3), (27, by - 2), (29, by - 3 + lift)], 1), DARK, contact=False)
    s.part(limb([(22, by + 3), (23, by - 3), (25, by - 5 + lift)], 1), darker(DARK), contact=False)
    s.dots([(28, by + 9), (29, by + 8)], RED[0])           # mandible
    # shell seam, shine and a "</>" glyph
    s.vline(14, by + 1, by + 9, GREEN[0])
    s.dots([(8, by + 2), (9, by + 2), (8, by + 3)], GREEN[3])
    lt = [(9, by + 5), (8, by + 6), (9, by + 7)]
    slash = [(12, by + 4), (12, by + 5), (11, by + 6), (11, by + 7)]
    gt = [(16, by + 5), (17, by + 6), (16, by + 7)]
    s.dots(lt + slash + gt, GREEN[0])
    for i, lx in enumerate((10, 15, 20)):               # near legs
        sw = swing[(t + i * 2) % 6]
        s.part(limb([(lx, by + 7), (lx + sw + 2, by + 10), (lx + sw + 1, 30)], 1), darker(GREEN, 0.45))
    return s


save(strip([bug(t) for t in range(6)]), 'bug.png')


# --- Heisenbug: a moth that is never quite where you look ---------------------------------
def fly(t):
    s = Sprite(32, 32)
    hover = (0, -1, 0, 1)[t]
    tip_y = (-9, -4, 4, -4)[t]           # wing tip height relative to the shoulder
    cx, cy = 15, 17 + hover
    for side, col in ((-1, darker(WING, 0.2)), (1, WING)):
        tx, ty = cx - 7 + side * 2, cy - 2 + tip_y + (1 if side < 0 else 0)
        s.part(poly([(cx, cy - 2), (tx - 3, ty - 3), (tx - 1, ty + 4), (cx + 1, cy + 2)]), col, contact=False)
        s.dots([(tx, ty), (tx + 1, ty + 1), (tx + 2, ty + 1)], WING[0])   # vein
    s.part(ellipse(cx - 2, cy - 3, cx + 5, cy + 8), PURPLE)            # abdomen
    s.hline(cx - 1, cx + 3, cy + 2, PURPLE[0])
    s.hline(cx - 1, cx + 3, cy + 5, PURPLE[0])
    s.part(ellipse(cx + 2, cy - 7, cx + 9, cy - 1), PURPLE)            # head
    s.part(ellipse(cx + 5, cy - 6, cx + 8, cy - 3), [YELLOW[1], YELLOW[2], YELLOW[3], WHITE])
    s.dot(cx + 7, cy - 5, EYE)
    s.part(limb([(cx + 6, cy - 7), (cx + 9, cy - 11), (cx + 11, cy - 11)], 1), DARK, contact=False)
    s.part(limb([(cx + 1, cy + 8), (cx + 1, cy + 10)], 1), DARK, contact=False)
    return s


save(strip([fly(t) for t in range(4)]), 'fly.png')


# --- Rogue cron bot ----------------------------------------------------------------------
def bot(pose='idle', t=0):
    s = Sprite(48, 48)
    step = (0, 3, 0, -3)[t] if pose == 'walk' else 0
    bob = 1 if pose == 'walk' and t % 2 else 0
    hip = (23, 33 + bob)
    for sgn, col in ((-1, darker(GUNMETAL)), (1, GUNMETAL)):
        foot = (23 + sgn * step + sgn * 2, 45)
        knee = (hip[0] + sgn * step // 2 + 3, 39 + bob)
        s.part(limb([hip, knee, foot], 3), col)
        s.part(rrect(foot[0] - 3, 44, foot[0] + 4, 47, 1), col)
    s.part(limb([(19, 27 + bob), (17, 32 + bob), (20, 35 + bob)], 3), darker(GUNMETAL))   # far arm
    s.part(rrect(14, 21 + bob, 31, 35 + bob, 3), METAL)                                   # torso
    s.part(rect(17, 24 + bob, 27, 31 + bob), [DARK[0], DARK[0], DARK[1], DARK[1]], contact=False)
    # chest screen: a cron clock "* * * * *"
    for i in range(5):
        s.dot(18 + i * 2, 26 + bob, GLOW_RED if (i + t) % 2 else (255, 160, 120))
    s.hline(18, 26, 29 + bob, TEAL[3])
    s.hline(18, 22, 30 + bob, TEAL[1])
    s.hline(15, 30, 34 + bob, METAL[0])
    s.part(rrect(16, 9 + bob, 31, 20 + bob, 3), METAL)                                    # head
    s.part(rect(21, 13 + bob, 31, 16 + bob), [GLOW_RED, GLOW_RED, GLOW_RED, GLOW_RED_HI], contact=False)
    s.hline(22, 30, 13 + bob, GLOW_RED_HI)
    s.vline(20, 4 + bob, 8 + bob, GUNMETAL[2])
    s.part(ellipse(19, 2 + bob, 21, 4 + bob), RED)
    # blaster arm
    s.part(rrect(28, 26 + bob, 39, 30 + bob, 1), GUNMETAL)
    s.part(rect(38, 27 + bob, 41, 28 + bob), DARK)
    s.part(limb([(26, 23 + bob), (28, 27 + bob)], 4), METAL)
    s.hline(30, 36, 26 + bob, GUNMETAL[3])
    if pose == 'shoot':
        r = 3 if t == 0 else 2
        cx, cy = 43, 28 + bob
        s.part(ellipse(cx - r, cy - r + 1, cx + r, cy + r - 1), [FLASH_HOT, FLASH_HOT, FLASH, WHITE], contact=False)
        s.dots([(cx + r + 1, cy), (cx, cy - r), (cx, cy + r)], FLASH)
    return s


save(strip([bot('idle')] + [bot('walk', t) for t in range(4)] + [bot('shoot', t) for t in range(2)]), 'bot.png')


# --- Merge-conflict turret ----------------------------------------------------------------
def turret(state=0):
    s = Sprite(32, 32)
    kick = 1 if state == 2 else 0
    s.part(rrect(3, 16, 28, 31, 2), GUNMETAL)
    s.part(rect(6, 19, 25, 28), [DARK[0]] * 2 + [DARK[1]] * 2, contact=False)
    # <<<<<<< / ======= / >>>>>>> in red, white, green
    for i, col in enumerate((GLOW_RED, WHITE, GLOW_GREEN)):
        y = 20 + i * 3
        for k in range(5):
            x = 8 + k * 3
            if i == 0:
                s.dots([(x + 1, y), (x, y + 1), (x + 1, y + 2)][:2], col)
            elif i == 1:
                s.hline(x, x + 1, y + 1, col)
            else:
                s.dots([(x, y), (x + 1, y + 1)], col)
    s.part(ellipse(9, 7, 22, 19), METAL)                                     # dome
    s.part(rect(19 - kick, 12, 31 - kick, 15), GUNMETAL)                     # barrel
    s.hline(19 - kick, 30 - kick, 12, GUNMETAL[3])
    s.part(ellipse(12, 10, 16, 13), [GLOW_RED, GLOW_RED, GLOW_RED, GLOW_RED_HI] if state else RED, contact=False)
    if state == 1:
        s.part(ellipse(26, 9, 31, 18), [FLASH_HOT, FLASH_HOT, FLASH, WHITE], contact=False)
    return s


save(strip([turret(0), turret(1), turret(2)]), 'turret.png')


# --- Boss: THE MONOLITH, a 15-year-old mainframe nobody dares to touch ---------------------
def boss(state='idle', t=0):
    s = Sprite(96, 96)
    rage = state == 'rage'
    shell = ramp('#8a4c64') if rage else ramp('#5c6488')
    # cable arms hanging from the sides
    for side in (-1, 1):
        x0 = 48 + side * 34
        sway = (t * 2 - 1) * side
        s.part(limb([(x0, 42), (x0 + side * 8, 52), (x0 + side * 9 + sway, 66), (x0 + side * 6 + sway, 74)], 5), CORAL)
        s.part(rrect(x0 + side * 6 + sway - 3, 72, x0 + side * 6 + sway + 3, 79, 1), GUNMETAL)
        s.vline(x0 + side * 6 + sway - 1, 80, 82, METAL[3])
        s.vline(x0 + side * 6 + sway + 1, 80, 82, METAL[3])
    s.part(rrect(14, 30, 82, 95, 4), shell)                                         # cabinet
    s.part(rect(14, 30, 82, 35), [shell[1], shell[2], shell[3], shell[3]])
    # rack slots with blinking LEDs and tape drives
    for i, y in enumerate(range(40, 90, 8)):
        s.part(rect(20, y, 76, y + 5), [DARK[0], DARK[0], DARK[1], DARK[1]], contact=False)
        for k in range(7):
            lit = (i + k + t + (state == 'open')) % 3 == 0
            col = GLOW_RED if rage and lit else (GLOW_GREEN if lit else GREEN[0])
            s.dot(23 + k * 4, y + 2, col)
            s.dot(23 + k * 4, y + 3, mix(col, INK, 0.4))
        s.hline(54, 73, y + 2, (44, 52, 80))
        s.dot(58 + (i * 3 + t * 5) % 14, y + 2, TEAL[3])
    # sticky note: DO NOT TOUCH
    s.part(rect(60, 64, 74, 76), YELLOW, contact=False)
    for y in (67, 70, 73):
        s.hline(62, 72 - (y == 70) * 3, y, (90, 70, 40))
    # the CRT head with its eye (shots come from (42, 22))
    s.part(rrect(24, 4, 64, 36, 4), shell)
    s.part(rrect(28, 8, 58, 32, 3), [rgb('#0d1a1c')] * 2 + [rgb('#12272a')] * 2, contact=False)
    eye_col = [GLOW_RED, GLOW_RED, GLOW_RED, GLOW_RED_HI] if rage else [GREEN[1], GLOW_GREEN, GLOW_GREEN, GLOW_GREEN_HI]
    open_h = {'idle': 5, 'open': 8, 'rage': 7}[state] - (1 if t and state == 'idle' else 0)
    s.part(ellipse(33, 22 - open_h, 51, 22 + open_h), eye_col, contact=False)
    s.part(ellipse(39, 22 - min(open_h, 4), 45, 22 + min(open_h, 4)), [EYE] * 4, contact=False)
    s.dots([(40, 20), (41, 20)], WHITE)
    for y in range(9, 32, 2):                                                     # scanlines
        for x in range(29, 58):
            if (x, y) in s.px:
                s.px[(x, y)] = mix(s.px[(x, y)], (0, 0, 0), 0.25)
    s.part(rect(60, 10, 63, 30), GUNMETAL, contact=False)                            # side vents
    for y in range(12, 30, 3):
        s.hline(60, 63, y, DARK[0])
    # beacon
    s.part(rect(42, 0, 46, 4), [GLOW_RED if (t or rage) else RED[1]] * 3 + [GLOW_RED_HI])
    if rage:
        for (x, y) in ((18, 46), (78, 58), (30, 84), (70, 40)):
            s.dots([(x, y), (x + 1, y - 1), (x - 1, y + 1)], FLASH)
    return s


save(strip([boss('idle', 0), boss('idle', 1), boss('open', 0), boss('open', 1), boss('rage', 0), boss('rage', 1)]), 'boss.png')


# --- Pickups (16x16): Heavy Commit, Claude Spark, Revert Grenade, Coffee, Story Points -----
def pickup(kind):
    s = Sprite(16, 16)
    s.part(rrect(1, 2, 14, 15, 3), GUNMETAL)
    s.part(rrect(3, 4, 12, 13, 2), [DARK[0], DARK[1], DARK[1], DARK[2]], contact=False)
    if kind == 'heavy':
        for x in (5, 9):
            s.vline(x, 5, 12, YELLOW[2])
            s.vline(x + 1, 5, 12, YELLOW[1])
        s.hline(5, 10, 8, YELLOW[3])
    elif kind == 'claude':
        for ang in range(0, 360, 45):
            for r in range(1, 5):
                x = 8 + round(math.cos(math.radians(ang + 22)) * r)
                y = 8 + round(math.sin(math.radians(ang + 22)) * r)
                s.dot(x, y, CORAL[3] if r < 3 else CORAL[2])
        s.dot(8, 8, WHITE)
    elif kind == 'grenade':
        s.part(ellipse(4, 6, 11, 13), LIME, contact=False)
        s.part(rect(6, 4, 9, 6), GUNMETAL, contact=False)
        s.dots([(10, 3), (11, 3), (11, 4)], METAL[3])
        s.dots([(6, 8), (7, 8)], LIME[3])
    elif kind == 'coffee':
        s.part(rect(4, 7, 10, 13), [rgb('#d8d8e8')] * 2 + [WHITE] * 2, contact=False)
        s.part(rect(11, 8, 12, 11), [rgb('#d8d8e8')] * 4, contact=False)
        s.hline(5, 9, 7, rgb('#6a3a20'))
        s.dots([(6, 4), (6, 5), (8, 3), (8, 5)], (200, 200, 220))
    else:
        s.part(poly([(8, 3), (13, 8), (8, 13), (3, 8)]), [YELLOW[0], YELLOW[1], YELLOW[2], YELLOW[3]], contact=False)
        s.dots([(7, 6), (6, 7)], WHITE)
    return s


save(strip([pickup(k) for k in ('heavy', 'claude', 'grenade', 'coffee', 'points')]), 'pickups.png')


# --- Neon signage (billboards) and HUD panels --------------------------------------------
# Drawn straight onto RGBA images so glass, glow halos and backings can be
# translucent. Text is drawn on top by the game with the pixel fonts.
NEON_CYAN = rgb('#2fd8ff')
NEON_PINK = rgb('#ff4fd8')
NEON_RED = rgb('#ff4a5c')
HAZARD_YELLOW = rgb('#ffcf3a')


def canvas(w, h):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


def rgba(color, alpha=255):
    return tuple(color[:3]) + (alpha,)


def bevel_box(d, x0, y0, x1, y1, colors, r=2):
    """A shaded metal box: light top/left rim, dark bottom/right rim."""
    shadow, dark, mid, light = colors
    d.rounded_rectangle([x0, y0, x1, y1], radius=r, fill=rgba(shadow))
    d.rounded_rectangle([x0, y0, x1 - 1, y1 - 1], radius=r, fill=rgba(light))
    d.rounded_rectangle([x0 + 1, y0 + 1, x1 - 1, y1 - 1], radius=r, fill=rgba(dark))
    d.rounded_rectangle([x0 + 1, y0 + 1, x1 - 2, y1 - 2], radius=r, fill=rgba(mid))


def bolt(d, x, y):
    d.rectangle([x, y, x + 1, y + 1], fill=rgba(METAL[3]))
    d.point((x + 1, y + 1), fill=rgba(METAL[0]))


def glass(d, x0, y0, x1, y1, base=rgb('#0a0d24'), line=rgb('#111a3e'), alpha=235):
    d.rectangle([x0, y0, x1, y1], fill=rgba(base, alpha))
    for y in range(y0 + 1, y1, 2):
        d.line([(x0, y), (x1, y)], fill=rgba(line, alpha))
    for y in range(y0 + 2, y1, 4):
        for x in range(x0 + 2, x1, 4):
            d.point((x, y), fill=rgba(mix(line, (60, 80, 160), 0.3), alpha))


def glow_rect(d, x0, y0, x1, y1, color, width=2, r=3):
    """Neon tube: halo outside and inside, bright core, white-hot centre line."""
    halo = rgba(color, 70)
    d.rounded_rectangle([x0 - 1, y0 - 1, x1 + 1, y1 + 1], radius=r + 1, outline=halo, width=1)
    d.rounded_rectangle([x0 + width, y0 + width, x1 - width, y1 - width], radius=max(0, r - width), outline=halo, width=1)
    d.rounded_rectangle([x0, y0, x1, y1], radius=r, outline=rgba(color), width=width)
    d.rounded_rectangle([x0, y0, x1, y1], radius=r, outline=rgba(mix(color, WHITE, 0.6)), width=1)


def ink_outline(img):
    return selective_outline(img) if img.getbbox() else img


def sign_screen():
    """Rooftop LED screen: metal frame, glass with scanlines, lamps on top."""
    img, d = canvas(160, 64)
    bevel_box(d, 0, 4, 159, 63, GUNMETAL, r=3)
    glass(d, 5, 9, 154, 58)
    d.rectangle([5, 9, 154, 9], fill=rgba(NEON_CYAN, 120))         # top glow line
    d.rectangle([5, 58, 154, 58], fill=rgba(NEON_CYAN, 60))
    for x, y in ((2, 6), (156, 6), (2, 60), (156, 60)):
        bolt(d, x, y)
    for x in (30, 80, 130):                                         # lamps
        d.rectangle([x - 3, 0, x + 3, 4], fill=rgba(GUNMETAL[1]))
        d.rectangle([x - 2, 4, x + 2, 5], fill=rgba(FLASH))
        d.rectangle([x - 4, 6, x + 4, 7], fill=rgba(FLASH, 60))
    return ink_outline(img)


def sign_pole():
    img, d = canvas(8, 16)
    shades = [METAL[0], METAL[1], METAL[2], METAL[3], METAL[3], METAL[2], METAL[1], METAL[0]]
    for x, c in enumerate(shades):
        d.line([(x, 0), (x, 15)], fill=rgba(mix(c, INK, 0.25)))
    d.rectangle([1, 7, 6, 8], fill=rgba(GUNMETAL[1]))
    d.point((3, 7), fill=rgba(METAL[3]))
    return img


def sign_neon(color):
    """Bare neon tube on a smoked backing, clamped to the wall."""
    img, d = canvas(160, 56)
    d.rounded_rectangle([4, 4, 155, 51], radius=4, fill=rgba(rgb('#0a0820'), 150))
    glow_rect(d, 4, 4, 155, 51, color, width=2, r=5)
    for x in (16, 143):
        for y in (2, 49):
            d.rectangle([x - 2, y, x + 3, y + 4], fill=rgba(GUNMETAL[1]))
            d.rectangle([x - 2, y, x + 3, y], fill=rgba(GUNMETAL[3]))
            d.point((x, y + 2), fill=rgba(METAL[3]))
    return img


def sign_hanging():
    """Backlit lightbox hung from cables: cream panel, dark ink lettering."""
    img, d = canvas(160, 60)
    for x in (22, 137):                                              # eyelets
        d.ellipse([x - 2, 0, x + 2, 5], outline=rgba(METAL[2]), width=1)
    bevel_box(d, 0, 4, 159, 59, ramp('#2c5c70'), r=2)
    top, bottom = rgb('#f6f1dc'), rgb('#cfc7ad')
    for y in range(9, 55):
        t = (y - 9) / 45
        d.line([(5, y), (154, y)], fill=rgba(mix(top, bottom, t)))
    d.line([(5, 9), (154, 9)], fill=rgba(WHITE))
    for x in range(8, 152, 9):                                       # tube hot spots behind the panel
        d.point((x, 11), fill=rgba(WHITE))
    for x, y in ((2, 6), (156, 6), (2, 56), (156, 56)):
        bolt(d, x, y)
    return ink_outline(img)


def sign_cable():
    img, d = canvas(2, 16)
    d.line([(0, 0), (0, 15)], fill=rgba(rgb('#1a1630')))
    d.line([(1, 0), (1, 15)], fill=rgba(rgb('#3a3658')))
    return img


def hazard_band(img, x0, y0, x1, y1, phase=0):
    """Yellow/black stripes clipped to the band rectangle."""
    w, h = x1 - x0 + 1, y1 - y0 + 1
    band, bd = canvas(w, h)
    bd.rectangle([0, 0, w, h], fill=rgba(rgb('#141018')))
    for x in range(-h + phase, w + 1, 10):
        bd.polygon([(x, h), (x + 5, h), (x + 5 + h, 0), (x + h, 0)], fill=rgba(HAZARD_YELLOW))
    img.alpha_composite(band, (x0, y0))


def sign_hazard():
    """PRODUCTION: red frame, hazard stripes, warning lamps."""
    img, d = canvas(192, 72)
    bevel_box(d, 0, 0, 191, 71, ramp('#8a2a3a'), r=3)
    hazard_band(img, 4, 4, 187, 10)
    hazard_band(img, 4, 61, 187, 67, phase=5)
    glass(d, 4, 12, 187, 59, base=rgb('#12060f'), line=rgb('#1e0a18'))
    d.rectangle([4, 12, 187, 12], fill=rgba(NEON_RED, 140))
    for x, y in ((8, 14), (179, 14), (8, 51), (179, 51)):            # warning lamps
        d.ellipse([x - 2, y - 2, x + 6, y + 6], fill=rgba(NEON_RED, 60))
        d.rectangle([x, y, x + 4, y + 4], fill=rgba(GLOW_RED))
        d.point((x + 1, y + 1), fill=rgba(GLOW_RED_HI))
    return ink_outline(img)


def hud_banner(warn=False):
    """Slanted announcement strip. 320x30; text sits in the middle."""
    W = 320
    img, d = canvas(W, 30)
    edge, accent = (NEON_RED, HAZARD_YELLOW) if warn else (NEON_CYAN, NEON_PINK)
    shape = [(10, 0), (W - 1, 0), (W - 11, 29), (0, 29)]
    d.polygon(shape, fill=rgba(rgb('#0c0a24'), 225))
    if warn:
        stripes, sd = canvas(W, 30)
        for x0 in (0, W - 34):                                          # hazard ends
            for k in range(0, 34, 8):
                x = x0 + k
                sd.polygon([(x, 29), (x + 4, 29), (x + 14, 0), (x + 10, 0)], fill=rgba(HAZARD_YELLOW, 200))
        mask = Image.new('L', (W, 30), 0)
        ImageDraw.Draw(mask).polygon(shape, fill=255)
        img.paste(stripes, (0, 0), Image.composite(stripes.getchannel('A'), mask, mask).point(lambda v: v))
    d.line([(10, 0), (W - 1, 0)], fill=rgba(edge))
    d.line([(10, 1), (W - 2, 1)], fill=rgba(mix(edge, WHITE, 0.5)))
    d.line([(0, 29), (W - 11, 29)], fill=rgba(accent))
    d.line([(1, 28), (W - 11, 28)], fill=rgba(accent, 90))
    if not warn:
        for i in range(2):                                           # >> and << chevrons
            x = 14 + i * 6
            d.line([(x, 10), (x + 4, 15), (x, 20)], fill=rgba(edge), width=2)
            x = W - 18 - i * 6
            d.line([(x, 10), (x - 4, 15), (x, 20)], fill=rgba(edge), width=2)
    return img


def hud_bossbar():
    """Boss health frame: CRT-eye plate and a dark slot (fill drawn by the game)."""
    img, d = canvas(208, 18)
    bevel_box(d, 0, 0, 207, 17, GUNMETAL, r=2)
    bevel_box(d, 2, 2, 19, 15, METAL, r=2)
    d.rectangle([5, 4, 16, 13], fill=rgba(rgb('#0d1a1c')))
    d.ellipse([6, 5, 15, 12], fill=rgba(GLOW_GREEN))
    d.rectangle([9, 6, 12, 11], fill=rgba(EYE))
    d.point((10, 7), fill=rgba(WHITE))
    d.rectangle([22, 5, 204, 12], fill=rgba(rgb('#0a0612')))
    d.line([(22, 5), (204, 5)], fill=rgba(rgb('#05030a')))
    for x in range(40, 204, 20):                                     # tick marks
        d.line([(x, 13), (x, 14)], fill=rgba(GUNMETAL[0]))
    return ink_outline(img)


save(sign_screen(), 'sign_screen.png')
save(sign_pole(), 'sign_pole.png')
save(sign_neon(NEON_CYAN), 'sign_neon_cyan.png')
save(sign_neon(NEON_PINK), 'sign_neon_pink.png')
save(sign_hanging(), 'sign_hanging.png')
save(sign_cable(), 'sign_cable.png')
save(sign_hazard(), 'sign_hazard.png')
save(hud_banner(), 'hud_banner.png')
save(hud_banner(warn=True), 'hud_banner_warn.png')
save(hud_bossbar(), 'hud_bossbar.png')

print('character art written to', os.path.abspath(OUT))
