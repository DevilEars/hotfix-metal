#!/usr/bin/env python3
"""Synthesises the sound effects and a chiptune loop for HOTFIX METAL.

All audio is generated from scratch (square/triangle/noise), so there is
nothing to license. Re-run with `npm run assets`.
"""
import os
import wave

import numpy as np

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
os.makedirs(OUT, exist_ok=True)
SR = 22050
rng = np.random.default_rng(42)


def save(name, data):
    data = np.clip(data, -1, 1)
    pcm = (data * 32767 * 0.8).astype('<i2')
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def t_axis(sec):
    return np.arange(int(SR * sec)) / SR


def square(freq, t, duty=0.5):
    return np.where((freq * t) % 1.0 < duty, 1.0, -1.0)


def tri(freq, t):
    return 2 * np.abs(2 * ((freq * t) % 1.0) - 1) - 1


def env(n, attack=0.005, decay=6.0):
    t = np.arange(n) / SR
    return np.minimum(1, t / attack) * np.exp(-decay * t)


def sweep(f0, f1, sec, wave_fn=square):
    t = t_axis(sec)
    f = f0 + (f1 - f0) * (t / sec)
    phase = np.cumsum(f) / SR
    return wave_fn(1, phase) if wave_fn is not square else np.where(phase % 1.0 < 0.5, 1.0, -1.0)


# Effects ----------------------------------------------------------------------
save('shoot.wav', sweep(1400, 400, 0.09) * env(int(SR * 0.09), decay=18))
save('shoot_heavy.wav', (sweep(900, 200, 0.07) + 0.5 * rng.uniform(-1, 1, int(SR * 0.07))) * env(int(SR * 0.07), decay=20) * 0.8)
save('claude.wav', (sweep(600, 1800, 0.18) * 0.6 + sweep(900, 2700, 0.18) * 0.3) * env(int(SR * 0.18), decay=9))
save('jump.wav', sweep(300, 800, 0.16) * env(int(SR * 0.16), decay=7))
save('hurt.wav', (sweep(500, 80, 0.45) * 0.7 + 0.4 * rng.uniform(-1, 1, int(SR * 0.45))) * env(int(SR * 0.45), decay=5))
save('explode.wav', rng.uniform(-1, 1, int(SR * 0.5)) * env(int(SR * 0.5), attack=0.002, decay=7))
save('hit.wav', (rng.uniform(-1, 1, int(SR * 0.05)) + sweep(700, 300, 0.05) * 0.5) * env(int(SR * 0.05), decay=40))
save('grenade.wav', sweep(250, 600, 0.12) * env(int(SR * 0.12), decay=10))

# Pickup / rescue jingles
def arp(notes, step, wave_fn=square):
    parts = []
    for n in notes:
        t = t_axis(step)
        parts.append(wave_fn(n, t) * env(len(t), decay=7))
    return np.concatenate(parts)


save('pickup.wav', arp([660, 880, 1320], 0.06))
save('rescue.wav', arp([523, 659, 784, 1047, 1319], 0.07))
save('victory.wav', arp([523, 659, 784, 1047, 784, 1047, 1319, 1568], 0.12))
save('gameover.wav', arp([440, 392, 349, 262], 0.22, tri))
save('boss.wav', (sweep(120, 50, 0.9) + 0.4 * rng.uniform(-1, 1, int(SR * 0.9))) * env(int(SR * 0.9), decay=2.5))

# Music: 8-bar loop at 140 BPM in A minor (bass + arpeggio + hat)
bpm = 140
beat = 60 / bpm
step = beat / 2  # eighth notes
bars = 8
total = int(SR * step * 8 * bars)
music = np.zeros(total)
note = lambda m: 440.0 * 2 ** ((m - 69) / 12)
prog = [57, 53, 48, 55, 57, 53, 52, 55]  # A F C G A F E G (bass roots, MIDI)
arp_shape = [0, 7, 12, 7, 15, 12, 7, 12]
for bar in range(bars):
    root = prog[bar]
    for s in range(8):
        pos = int(SR * step * (bar * 8 + s))
        n = int(SR * step)
        t = np.arange(n) / SR
        bass = tri(note(root - 12), t) * env(n, decay=4) * 0.55
        lead = square(note(root + 12 + arp_shape[s] % 12 + (12 if s % 4 == 3 else 0)), t, 0.25) * env(n, decay=8) * 0.18
        hat = rng.uniform(-1, 1, n) * env(n, attack=0.001, decay=60) * (0.12 if s % 2 else 0.05)
        kick = np.zeros(n)
        if s in (0, 4):
            kick = np.sin(2 * np.pi * (110 - 70 * t / 0.12).clip(40) * t) * env(n, decay=14) * 0.5
        seg = bass + lead + hat + kick
        music[pos:pos + n] += seg[: total - pos]
music /= np.max(np.abs(music)) * 1.1
save('music.wav', music)
print('audio written to', os.path.abspath(OUT))
