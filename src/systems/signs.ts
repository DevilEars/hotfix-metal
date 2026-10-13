import { EcsSystem } from '@forge-game-engine/forge/ecs';
import { Color } from '@forge-game-engine/forge/rendering';
import { TextEcsComponent, textId } from '@forge-game-engine/forge/text';
import { SignFlickerComponent, signFlickerId } from '../components';
import { Ctx } from '../ctx';

const DIM = 0.3;

/** Neon tubes stutter now and then; warning boards blink steadily. */
export function createSignFlickerSystem(ctx: Ctx): EcsSystem<[SignFlickerComponent, TextEcsComponent]> {
  const dimColors = new Map<number, Color>();

  return {
    name: 'hotfix-sign-flicker',
    query: [signFlickerId, textId],
    update: (_world, { entities, components: [signs, texts] }) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);
      const now = ctx.time.timeInSeconds;

      for (let i = 0; i < entities.length; i++) {
        const sign = signs[i];
        let lit: boolean;

        if (sign.mode === 'blink') {
          lit = (now + sign.phase) % 1.2 < 0.85;
        } else {
          if (sign.dim > 0) {
            sign.dim -= dt;
          } else if (ctx.random.randomFloat(0, 1) < dt * 0.35) {
            sign.dim = ctx.random.randomFloat(0.05, 0.22);
          }
          lit = sign.dim <= 0;
        }

        let dim = dimColors.get(entities[i]);
        if (!dim) {
          const { r, g, b, a } = sign.base;
          dim = new Color(r * DIM, g * DIM, b * DIM, a);
          dimColors.set(entities[i], dim);
        }
        texts[i].color = lit ? sign.base : dim;
      }
    },
  };
}
