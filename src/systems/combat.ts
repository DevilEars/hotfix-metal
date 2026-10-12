import { PositionEcsComponent, positionId } from '@forge-game-engine/forge/common';
import { colliderId } from '@forge-game-engine/forge/physics';
import { Color } from '@forge-game-engine/forge/rendering';
import {
  EnemyComponent,
  enemyId,
  HostageComponent,
  PickupComponent,
  PlayerComponent,
  playerId,
} from '../components';
import { RESPAWN_INVULNERABLE_SECONDS } from '../constants';
import { Ctx } from '../ctx';
import { spawnExplosion, spawnPickup, spawnPopup } from '../spawn';

const gold = new Color(1, 0.86, 0.35, 1);
const lime = new Color(0.65, 0.76, 0.29, 1);
const orange = new Color(0.95, 0.5, 0.35, 1);
const white = new Color(1, 1, 1, 1);

/** Applies damage to an enemy, awarding score and effects when it dies. */
export function damageEnemy(ctx: Ctx, entity: number, amount: number): void {
  const { world } = ctx;
  const enemy = world.getComponent(entity, enemyId);
  const position = world.getComponent(entity, positionId);

  if (!enemy || !position || enemy.hp <= 0) {
    return;
  }

  enemy.hp -= amount;
  enemy.flash = 0.09;
  ctx.sfx('hit', 0.25, 0.9 + ctx.random.randomFloat(0, 0.3));

  if (enemy.kind === 'boss') {
    ctx.state.bossHp = Math.max(0, enemy.hp);

    if (enemy.hp <= 0) {
      // The boss system plays the death sequence.
      enemy.timer = 2.4;
      enemy.time = 0;
      world.removeComponent(entity, colliderId);
      ctx.state.score += enemy.score;
    }

    return;
  }

  if (enemy.hp <= 0) {
    killEnemy(ctx, entity, enemy, position);
  }
}

function killEnemy(
  ctx: Ctx,
  entity: number,
  enemy: EnemyComponent,
  position: PositionEcsComponent,
): void {
  const { world, random } = ctx;
  const centerY = position.local.y + (enemy.kind === 'fly' ? 0.6 : enemy.kind === 'turret' ? 0.8 : 0.9);

  spawnExplosion(ctx, position.local.x, centerY, enemy.kind === 'turret' ? 1.5 : 1);
  ctx.state.score += enemy.score;

  if (enemy.kind === 'bug' || enemy.kind === 'fly') {
    ctx.state.bugsSquashed += 1;
  }

  spawnPopup(ctx, position.local.x, centerY + 0.8, `+${enemy.score}`, white);

  // Turrets and bots sometimes drop story points.
  if ((enemy.kind === 'turret' || enemy.kind === 'bot') && random.randomFloat(0, 1) < 0.35) {
    spawnPickup(ctx, 'points', position.local.x, position.local.y + 0.4, true);
  }

  world.removeEntity(entity);
}

/** The player takes a hit: lose a life, hop, and respawn after a moment. */
export function killPlayer(ctx: Ctx, player: PlayerComponent, position: PositionEcsComponent): void {
  if (player.dead || player.invulnerable > 0) {
    return;
  }

  player.dead = true;
  player.deadTimer = 1.5;
  player.vy = 11;
  player.vx = -player.facing * 3;
  ctx.state.lives -= 1;
  ctx.state.weapon = 'commit';
  ctx.state.ammo = 0;
  spawnExplosion(ctx, position.local.x, position.local.y + 1, 0.8);
  ctx.sfx('hurt', 0.6);
  ctx.cam.shake = Math.max(ctx.cam.shake, 0.35);
}

export function respawnOrEnd(ctx: Ctx, player: PlayerComponent, position: PositionEcsComponent): void {
  if (ctx.state.lives <= 0) {
    ctx.state.phase = 'gameover';
    ctx.sfx('gameover', 0.6);
    ctx.onGameOver();
    return;
  }

  player.dead = false;
  player.vx = 0;
  player.vy = 0;
  player.invulnerable = RESPAWN_INVULNERABLE_SECONDS;
  position.local.x = ctx.cam.x - ctx.cam.halfWidth * 0.55;
  position.local.y = 9;
}

export function collectPickup(
  ctx: Ctx,
  entity: number,
  pickup: PickupComponent,
  position: PositionEcsComponent,
): void {
  const { state, world } = ctx;
  const x = position.local.x;
  const y = position.local.y + 1.2;

  switch (pickup.kind) {
    case 'heavy':
      state.weapon = 'heavy';
      state.ammo = 120;
      spawnPopup(ctx, x, y, 'HEAVY COMMIT', gold);
      break;
    case 'claude':
      state.weapon = 'claude';
      state.ammo = 45;
      spawnPopup(ctx, x, y, 'CLAUDE ASSIST', orange);
      break;
    case 'grenade':
      state.grenades += 5;
      spawnPopup(ctx, x, y, '+5 REVERTS', lime);
      break;
    case 'coffee':
      state.lives = Math.min(state.lives + 1, 9);
      spawnPopup(ctx, x, y, '1UP COFFEE', white);
      break;
    case 'points':
      state.score += 250;
      spawnPopup(ctx, x, y, '+250', gold);
      break;
  }

  ctx.sfx('pickup', 0.5);
  world.removeEntity(entity);
}

export function rescueJunior(
  ctx: Ctx,
  entity: number,
  hostage: HostageComponent,
  position: PositionEcsComponent,
): void {
  if (hostage.state !== 'tied') {
    return;
  }

  hostage.state = 'free';
  hostage.runDir = ctx.random.randomFloat(0, 1) < 0.5 ? -1 : 1;
  hostage.timer = 2.4;
  ctx.state.rescued += 1;
  ctx.state.score += 500;
  ctx.sfx('rescue', 0.55);
  spawnPopup(ctx, position.local.x, position.local.y + 2.2, 'JUNIOR FREED +500', lime);
  spawnPickup(ctx, hostage.reward, position.local.x, position.local.y + 1.2, true);

  // Remove the hostage's collider so it can't be rescued twice.
  ctx.world.removeComponent(entity, colliderId);
}

export function currentPlayer(ctx: Ctx): { player: PlayerComponent; position: PositionEcsComponent } | null {
  if (ctx.player < 0 || !ctx.world.isAlive(ctx.player)) {
    return null;
  }

  const player = ctx.world.getComponent(ctx.player, playerId);
  const position = ctx.world.getComponent(ctx.player, positionId);

  return player && position ? { player, position } : null;
}

