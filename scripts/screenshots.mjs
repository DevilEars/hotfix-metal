#!/usr/bin/env node
// Captures README screenshots and a short gameplay GIF into docs/screenshots/.
//
// Builds nothing itself: run `npm run build` first (npm run screenshots does).
// Starts `vite preview`, drives a local headless Google Chrome over the
// DevTools protocol (Node's built-in WebSocket, no extra dependencies), and
// assembles the GIF with Python + Pillow. Set CHROME=/path/to/chrome to
// override the browser.
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs', 'screenshots');
const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
const CHROME =
  process.env.CHROME ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (!CHROME) {
  console.error('Google Chrome not found; set CHROME=/path/to/chrome');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' });
const debugPort = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), 'hotfix-shots-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    '--window-size=1280,720',
    '--hide-scrollbars',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--mute-audio',
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

async function connect() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json();
      const page = targets.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting.
    }
    await sleep(250);
  }
  throw new Error('Chrome did not start');
}

const ws = new WebSocket(await connect());
await new Promise((resolve) => ws.addEventListener('open', resolve));
let nextId = 0;
const pending = new Map();
const errors = [];
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  }
  if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description);
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

const KEYS = {
  Enter: ['Enter', 13],
  ArrowRight: ['ArrowRight', 39],
  KeyJ: ['j', 74],
  KeyK: ['k', 75],
};
const key = (type, code) => send('Input.dispatchKeyEvent', { type, code, key: KEYS[code][0], windowsVirtualKeyCode: KEYS[code][1] });
const tap = async (code, ms = 60) => {
  await key('keyDown', code);
  await sleep(ms);
  await key('keyUp', code);
};
const evaluate = (expression) => send('Runtime.evaluate', { expression, returnByValue: true }).then((r) => r?.result?.value);
const screenshot = async () => Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64');
const save = async (name) => {
  // Freeze blinking prompts in their visible state.
  await evaluate("document.querySelectorAll('.blink').forEach((el) => { el.style.animation = 'none'; })");
  writeFileSync(join(outDir, name), await screenshot());
  console.log('wrote', join('docs', 'screenshots', name));
};

async function open(query = '') {
  await send('Page.navigate', { url: BASE + query });
  // Wait until assets are loaded and the game object exists.
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate('Boolean(window.__hotfix)')) break;
    await sleep(250);
  }
  await sleep(600);
}

async function start() {
  await tap('Enter');
  await sleep(500);
}

try {
  await send('Runtime.enable');
  await send('Page.enable');

  // Title screen.
  await open();
  await sleep(1200);
  await save('title.png');

  // Zone 1: run right while shooting.
  await open();
  await start();
  await key('keyDown', 'ArrowRight');
  await key('keyDown', 'KeyJ');
  await sleep(1700);
  await save('zone1.png');
  await key('keyUp', 'KeyJ');
  await key('keyUp', 'ArrowRight');

  // Zone 2: bots, heisenbugs and platforms; jump mid-run.
  await open('?start=zone2');
  await start();
  await key('keyDown', 'ArrowRight');
  await key('keyDown', 'KeyJ');
  await sleep(1500);
  await tap('KeyK', 120);
  await sleep(250);
  await save('zone2.png');
  await key('keyUp', 'KeyJ');
  await key('keyUp', 'ArrowRight');

  // Boss arena: warning banner and health bar.
  await open('?start=boss');
  await start();
  await key('keyDown', 'KeyJ');
  await sleep(3200);
  await save('boss.png');
  await key('keyUp', 'KeyJ');

  // Game over: lose every life through the debug helper.
  await open();
  await start();
  for (let life = 0; life < 4; life++) {
    await evaluate('window.__hotfix.debug.hurtPlayer()');
    await sleep(2600);
  }
  await sleep(800);
  await save('gameover.png');

  // Gameplay GIF: ~3 s of zone 1 at 10 fps.
  await open();
  await start();
  await key('keyDown', 'ArrowRight');
  await key('keyDown', 'KeyJ');
  const frameDir = mkdtempSync(join(tmpdir(), 'hotfix-gif-'));
  for (let frame = 0; frame < 30; frame++) {
    if (frame === 12 || frame === 22) await tap('KeyK', 100);
    writeFileSync(join(frameDir, `${String(frame).padStart(3, '0')}.png`), await screenshot());
    await sleep(40);
  }
  execFileSync('python3', [
    '-c',
    `import glob, sys
from PIL import Image
frames = [Image.open(f).convert('RGB').resize((640, 360), Image.LANCZOS) for f in sorted(glob.glob(sys.argv[1] + '/*.png'))]
# One shared palette from a montage of several frames keeps colours true.
picks = frames[:: max(1, len(frames) // 6)]
montage = Image.new('RGB', (640, 360 * len(picks)))
for i, f in enumerate(picks):
    montage.paste(f, (0, 360 * i))
palette = montage.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
frames = [f.quantize(palette=palette, dither=Image.Dither.NONE) for f in frames]
frames[0].save(sys.argv[2], save_all=True, append_images=frames[1:], duration=100, loop=0, optimize=True)`,
    frameDir,
    join(outDir, 'gameplay.gif'),
  ]);
  rmSync(frameDir, { recursive: true, force: true });
  console.log('wrote', join('docs', 'screenshots', 'gameplay.gif'));

  if (errors.length) console.warn('page errors:\n' + errors.join('\n'));
} finally {
  ws.close();
  chrome.kill();
  preview.kill();
  rmSync(profile, { recursive: true, force: true });
}
