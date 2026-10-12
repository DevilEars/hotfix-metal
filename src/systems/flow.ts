import { EcsSystem } from '@forge-game-engine/forge/ecs';
import { BOSS_ARENA_CENTER } from '../constants';
import { Ctx } from '../ctx';
import { spawnScript, SpawnEntry } from '../level';
import { showBanner } from '../state';
import {
  spawnBoss,
  spawnEnemy,
  spawnJunior,
  spawnPickup,
} from '../spawn';

// The script is written in rough order; sort so the pointer walk is exact.
export const orderedScript: SpawnEntry[] = spawnScript
  .map((entry, index) => ({ entry, index }))
  .sort((a, b) => a.entry.trigger - b.entry.trigger || a.index - b.index)
  .map(({ entry }) => entry);

function fire(ctx: Ctx, entry: SpawnEntry): void {
  const right = ctx.cam.x + ctx.cam.halfWidth;
  const count = entry.count ?? 1;

  if (entry.banner) {
    showBanner(ctx.state, entry.banner, 3.5);
  }

  switch (entry.kind) {
    case 'bug':
      for (let k = 0; k < count; k++) {
        spawnEnemy(ctx, 'bug', right + 1.5 + k * 2.2, 0);
      }
      break;
    case 'bot':
      for (let k = 0; k < count; k++) {
        spawnEnemy(ctx, 'bot', right + 2 + k * 3.2, 0);
      }
      break;
    case 'fly':
      for (let k = 0; k < count; k++) {
        spawnEnemy(ctx, 'fly', right + 2 + k * 2.6, ctx.random.randomFloat(4.5, 9));
      }
      break;
    case 'turret':
      spawnEnemy(ctx, 'turret', entry.x ?? right + 2, entry.y ?? 0);
      break;
    case 'junior':
      spawnJunior(ctx, entry.x ?? right + 2, entry.y ?? 0, entry.reward ?? 'points');
      break;
    case 'pickup':
      spawnPickup(ctx, entry.reward ?? 'points', entry.x ?? right + 2, entry.y ?? 0);
      break;
    case 'boss':
      spawnBoss(ctx, right + 4);
      break;
  }
}

/** Game clock, input buffers and the level's spawn script. */
export function createFlowSystem(ctx: Ctx): EcsSystem<[]> {
  return {
    name: 'hotfix-flow',
    query: [],
    update: () => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);
      const { state, cam } = ctx;

      ctx.press.jump = Math.max(0, ctx.press.jump - dt);
      ctx.press.grenade = Math.max(0, ctx.press.grenade - dt);

      if (state.phase !== 'playing') {
        return;
      }

      state.runSeconds += dt;
      state.bannerSeconds = Math.max(0, state.bannerSeconds - dt);

      const right = cam.x + cam.halfWidth;

      while (ctx.nextSpawn < orderedScript.length) {
        const entry = orderedScript[ctx.nextSpawn];
        const reached =
          entry.kind === 'boss' ? cam.x >= BOSS_ARENA_CENTER - 0.3 : right >= entry.trigger;

        if (!reached) {
          break;
        }

        ctx.nextSpawn += 1;
        fire(ctx, entry);
      }
    },
  };
}
