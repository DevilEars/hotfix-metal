import { flipId, positionId, PositionEcsComponent } from '@forge-game-engine/forge/common';
import { EcsSystem } from '@forge-game-engine/forge/ecs';
import { spriteId } from '@forge-game-engine/forge/rendering';
import { Color } from '@forge-game-engine/forge/rendering';
import { bossId, EnemyComponent, enemyId } from '../components';

import { Ctx } from '../ctx';
import { showBanner } from '../state';
import {
  burst,
  spawnEnemy,
  spawnEnemyBullet,
  spawnExplosion,
} from '../spawn';
import { currentPlayer } from './combat';
import { setClip } from './player';

const flashTint = new Color(2.2, 2.2, 2.2, 1);
const normalTint = new Color(1, 1, 1, 1);
const rageTint = new Color(1.25, 0.85, 0.85, 1);

function aimedShot(ctx: Ctx, fromX: number, fromY: number, toX: number, toY: number, speed: number, spread = 0): void {
  const angle = Math.atan2(toY - fromY, toX - fromX) + spread;
  spawnEnemyBullet(ctx, fromX, fromY, Math.cos(angle) * speed, Math.sin(angle) * speed);
}

function updateBoss(ctx: Ctx, entity: number, enemy: EnemyComponent, position: PositionEcsComponent, dt: number): void {
  const { world, cam, state, random } = ctx;
  const boss = world.getComponentRequired(entity, bossId);
  const target = currentPlayer(ctx);
  const arenaX = cam.x + Math.min(cam.halfWidth - 3.6, 9.5);

  // Entry: slide in from off-screen and roar.
  if (!boss.entered) {
    position.local.x = Math.max(arenaX, position.local.x - 5 * dt);

    if (position.local.x <= arenaX + 0.01) {
      boss.entered = true;
      ctx.sfx('boss', 0.8);
      showBanner(state, 'WARNING - THE LEGACY MONOLITH | "NOBODY KNOWS HOW IT WORKS"', 4);
      ctx.cam.shake = 0.6;
    }

    return;
  }

  // Death sequence: a chain of explosions, then the win.
  if (enemy.hp <= 0) {
    enemy.timer -= dt;
    enemy.time += dt;

    if (Math.floor(enemy.time * 8) !== Math.floor((enemy.time - dt) * 8)) {
      spawnExplosion(
        ctx,
        position.local.x + random.randomFloat(-2.4, 2.4),
        position.local.y + random.randomFloat(0.5, 5.5),
        random.randomFloat(1, 1.8),
      );
    }

    if (enemy.timer <= 0) {
      spawnExplosion(ctx, position.local.x, position.local.y + 3, 3.5);
      burst(ctx, ctx.fx.confetti, position.local.x, position.local.y + 3, 28);
      world.removeEntity(entity);
      state.bossActive = false;
      state.phase = 'victory';
      ctx.sfx('victory', 0.6);
      ctx.onVictory();
    }

    return;
  }

  if (boss.phase === 1 && enemy.hp <= enemy.maxHp * 0.5) {
    boss.phase = 2;
    ctx.cam.shake = 0.5;
    ctx.sfx('boss', 0.7, 1.2);
    showBanner(state, 'PHASE 2 - PRODUCTION HOTFIX REQUIRED', 3);
  }

  // Hover side to side a little.
  enemy.time += dt;
  position.local.x = arenaX + Math.sin(enemy.time * (boss.phase === 2 ? 1.3 : 0.8)) * 1.2;

  const sprite = world.getComponentRequired(entity, spriteId);
  const rage = boss.phase === 2;

  boss.attackTimer -= dt;
  const eyeX = position.local.x - 0.4;
  const eyeY = position.local.y + 4.6;

  if (boss.attackTimer <= 0) {
    boss.pattern = (boss.pattern + 1) % 3;
    boss.attackTimer = rage ? 1.45 : 2.3;
    setClip(ctx, entity, ctx.assets.clip.boss_open, 300);
    enemy.state = 'shoot';
    enemy.shots = 0;

    if (boss.pattern === 0 && target) {
      // A fan of "stack trace" shots aimed at the player.
      const count = rage ? 7 : 5;
      for (let k = 0; k < count; k++) {
        aimedShot(ctx, eyeX, eyeY, target.position.local.x, target.position.local.y + 1, 7.5, (k - (count - 1) / 2) * 0.22);
      }
    } else if (boss.pattern === 1) {
      // Summon a regression: bugs from the right edge, flies from above.
      spawnEnemy(ctx, 'bug', cam.x + cam.halfWidth + 1, 0);
      spawnEnemy(ctx, 'fly', cam.x + cam.halfWidth + 1.5, random.randomFloat(5, 9));

      if (rage) {
        spawnEnemy(ctx, 'bug', cam.x - cam.halfWidth - 1, 0);
      }
    } else {
      // Exceptions rain from the ceiling.
      const columns = rage ? 9 : 6;
      for (let k = 0; k < columns; k++) {
        const x = cam.x - cam.halfWidth + ((k + random.randomFloat(0.2, 0.8)) / columns) * cam.halfWidth * 2;
        spawnEnemyBullet(ctx, x, 12.5, 0, -6.5 - random.randomFloat(0, 1.5));
      }
    }
  } else if (boss.attackTimer < (rage ? 0.9 : 1.6)) {
    setClip(ctx, entity, rage ? ctx.assets.clip.boss_rage : ctx.assets.clip.boss_idle, 300);
    enemy.state = 'idle';
  }

  sprite.tintColor = enemy.flash > 0 ? flashTint : rage ? rageTint : normalTint;
}

export function createEnemySystem(ctx: Ctx): EcsSystem<[EnemyComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-enemies',
    query: [enemyId, positionId],
    update: (world, { entities, components: [enemies, positions] }) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);
      const target = currentPlayer(ctx);
      const { cam, assets } = ctx;

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const enemy = enemies[i];
        const position = positions[i];

        if (!world.isAlive(entity)) {
          continue;
        }

        enemy.flash = Math.max(0, enemy.flash - dt);

        if (enemy.kind === 'boss') {
          updateBoss(ctx, entity, enemy, position, dt);
          continue;
        }

        const sprite = world.getComponentRequired(entity, spriteId);
        const flip = world.getComponent(entity, flipId);
        const px = target ? target.position.local.x : cam.x;
        const py = target ? target.position.local.y : 0;
        const dx = px - position.local.x;

        enemy.time += dt;
        enemy.timer -= dt;
        sprite.tintColor = enemy.flash > 0 ? flashTint : normalTint;

        // Despawn when left far behind the camera.
        if (position.local.x < cam.x - cam.halfWidth - 8) {
          world.removeEntity(entity);
          continue;
        }

        switch (enemy.kind) {
          case 'bug': {
            enemy.dir = dx >= 0 ? 1 : -1;
            position.local.x += enemy.dir * 2.8 * dt;
            break;
          }
          case 'bot': {
            enemy.dir = dx >= 0 ? 1 : -1;

            if (enemy.state === 'walk') {
              if (Math.abs(dx) > 8) {
                position.local.x += enemy.dir * 2.2 * dt;
                setClip(ctx, entity, assets.clip.bot_walk, 200);
              } else {
                setClip(ctx, entity, assets.clip.bot_idle, 200);
              }

              if (enemy.timer <= 0 && Math.abs(dx) < 12) {
                enemy.state = 'aim';
                enemy.timer = 0.45;
              }
            } else if (enemy.state === 'aim' && enemy.timer <= 0) {
              enemy.state = 'shoot';
              enemy.timer = 0.3;
              setClip(ctx, entity, assets.clip.bot_shoot, 200);
              aimedShot(ctx, position.local.x + enemy.dir * 1.0, position.local.y + 1.2, px, py + 1, 6.5);
            } else if (enemy.state === 'shoot' && enemy.timer <= 0) {
              enemy.state = 'walk';
              enemy.timer = ctx.random.randomFloat(1.2, 2.2);
            }
            break;
          }
          case 'fly': {
            enemy.dir = dx >= 0 ? 1 : -1;
            position.local.x += enemy.dir * 3.6 * dt;

            if (Math.abs(dx) < 9) {
              enemy.baseY += (py + 1.1 - enemy.baseY) * 0.9 * dt;
            }

            position.local.y = enemy.baseY + Math.sin(enemy.time * 4) * 0.8;
            break;
          }
          case 'turret': {
            enemy.dir = dx >= 0 ? 1 : -1;
            const onScreen = Math.abs(position.local.x - cam.x) < cam.halfWidth + 0.5;

            if (enemy.state === 'idle' && onScreen && enemy.timer <= 0) {
              enemy.state = 'shoot';
              enemy.shots = 3;
              enemy.timer = 0;
            }

            if (enemy.state === 'shoot' && enemy.timer <= 0) {
              if (enemy.shots > 0) {
                aimedShot(ctx, position.local.x + enemy.dir * 1.4, position.local.y + 1.0, px, py + 1, 7);
                enemy.shots -= 1;
                enemy.timer = 0.25;
                setClip(ctx, entity, assets.clip.turret_fire, 300);
              } else {
                enemy.state = 'idle';
                enemy.timer = ctx.random.randomFloat(1.6, 2.6);
                setClip(ctx, entity, assets.clip.turret_idle, 300);
              }
            }
            break;
          }
        }

        if (flip) {
          // Sprites are drawn facing right.
          flip.flipX = enemy.dir === -1;
        }
      }
    },
  };
}


