import { BRAND } from './brand';
import { createDebugTools } from './debug';
import { createHotfixGame, HotfixGame } from './game';

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

/** Shows the official logo if the file exists, otherwise a text wordmark. */
function fillLockup(target: HTMLElement, kind: 'entelect' | 'claude'): void {
  const brand = BRAND[kind];
  const tag = kind === 'entelect' ? BRAND.entelect.tagline : 'Preferred Partner';
  target.classList.add(kind);

  const text = document.createElement('span');
  text.className = 'wordmark';
  text.textContent = brand.name;
  const caption = document.createElement('span');
  caption.className = 'tag';
  caption.textContent = tag;
  target.append(text, caption);

  const probe = new Image();
  probe.alt = brand.name;
  probe.onload = () => {
    target.replaceChildren(probe, caption);
  };
  probe.src = brand.logo;
}

fillLockup($('entelect-lockup'), 'entelect');
fillLockup($('claude-lockup'), 'claude');
fillLockup($('entelect-lockup-2'), 'entelect');
fillLockup($('claude-lockup-2'), 'claude');
$('partner-line').textContent = `Entelect is a ${BRAND.claude.partnerLine.replace('Claude Partner Network - ', 'Claude Partner Network ')}`;

const screens = ['loading', 'title', 'gameover', 'victory'] as const;
const show = (name: (typeof screens)[number] | null): void => {
  for (const id of screens) {
    $(id).classList.toggle('show', id === name);
  }
};

const formatTime = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

let hotfix: HotfixGame | null = null;

async function boot(): Promise<void> {
  hotfix = await createHotfixGame({
    onGameOver: () => {
      const { state } = hotfix!.ctx;
      $('gameover-stats').textContent =
        `Story points: ${state.score}\nJuniors freed: ${state.rescued}/${state.juniorsTotal}`;
      show('gameover');
    },
    onVictory: () => {
      const { state } = hotfix!.ctx;
      $('victory-stats').textContent =
        `Story points: ${state.score}\nJuniors freed: ${state.rescued}/${state.juniorsTotal}\n` +
        `Bugs squashed: ${state.bugsSquashed}\nTime to resolve: ${formatTime(state.runSeconds)}`;
      show('victory');
    },
  });

  hotfix.game.run();
  show('title');
  (window as unknown as { __hotfix: HotfixGame & { debug: ReturnType<typeof createDebugTools> } }).__hotfix =
    Object.assign(hotfix, { debug: createDebugTools(hotfix.ctx) });
}

function startRun(): void {
  if (!hotfix) {
    return;
  }

  show(null);
  hotfix.ctx.restart();
}

window.addEventListener('keydown', (event) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
    event.preventDefault();
  }

  if (!hotfix || event.repeat) {
    return;
  }

  const { state } = hotfix.ctx;

  if (event.code === 'KeyM') {
    hotfix.ctx.muted = !hotfix.ctx.muted;
    hotfix.ctx.assets.mixer.master.muted = hotfix.ctx.muted;
  }

  if (event.code === 'Enter' && state.phase !== 'playing') {
    startRun();
  }
});

boot().catch((error: unknown) => {
  console.error(error);
  $('loading').innerHTML = `<p>Failed to start: ${String(error)}</p>`;
});
