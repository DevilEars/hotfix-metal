import { positionId } from '@forge-game-engine/forge/common';
import { EnemyComponent, enemyId, playerId } from './components';
import { Ctx } from './ctx';
import { damageEnemy, currentPlayer, killPlayer } from './systems/combat';

/**
 * Small helpers exposed on `window.__hotfix.debug` so the demo can be driven
 * from the console or an automated test (kill the boss, lose a life, ...).
 */
export function createDebugTools(ctx: Ctx) {
  return {
    killBoss: (): void => {
      const found = ctx.world.query<[EnemyComponent]>([enemyId]);
      found.entities.forEach((entity, index) => {
        if (found.components[0][index].kind === 'boss') {
          damageEnemy(ctx, entity, 9999);
        }
      });
    },
    hurtPlayer: (): void => {
      const target = currentPlayer(ctx);
      if (target) {
        target.player.invulnerable = 0;
        killPlayer(ctx, target.player, target.position);
      }
    },
    teleportPlayer: (x: number, y = 0): void => {
      const target = currentPlayer(ctx);
      if (target) {
        const position = ctx.world.getComponentRequired(ctx.player, positionId);
        ctx.cam.x = x;
        position.local.x = x;
        position.local.y = y;
      }
    },
    playerIds: (): number[] => [...ctx.world.query([playerId]).entities],
  };
}
