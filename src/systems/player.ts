import { PositionEcsComponent, positionId, FlipEcsComponent, flipId } from '@forge-game-engine/forge/common';
import { spriteAnimationId } from '@forge-game-engine/forge/animations';
import { EcsSystem } from '@forge-game-engine/forge/ecs';
import { colliderId } from '@forge-game-engine/forge/physics';
import { spriteId } from '@forge-game-engine/forge/rendering';
import { clamp } from '@forge-game-engine/forge/math';
import { PlayerComponent, playerId } from '../components';
import {
  GRAVITY,
  JUMP_SPEED,
  MAX_FALL_SPEED,
  PLAYER_CROUCH_HEIGHT,
  PLAYER_HALF_WIDTH,
  PLAYER_HEIGHT,
  RUN_SPEED,
  Tint,
} from '../constants';
import { Ctx } from '../ctx';
import { platforms } from '../level';
import { boxCollider, findLanding } from '../physics';
import { burst, spawnGrenade, spawnPlayerBullet } from '../spawn';
import { respawnOrEnd } from './combat';

const approach = (value: number, target: number, step: number): number =>
  value < target ? Math.min(value + step, target) : Math.max(value - step, target);

export function setClip(ctx: Ctx, entity: number, clip: number, frameMs: number): void {
  const animation = ctx.world.getComponentRequired(entity, spriteAnimationId);

  if (animation.animationClipHandle !== clip) {
    animation.animationClipHandle = clip;
    animation.animationFrameIndex = 0;
  }

  animation.frameDurationMilliseconds = frameMs;
}

function fireWeapon(ctx: Ctx, player: PlayerComponent, position: PositionEcsComponent): void {
  const { state } = ctx;
  const muzzleX = position.local.x + player.facing * (player.aimUp ? 0.3 : 1.2);
  const muzzleY = position.local.y + (player.aimUp ? 2.1 : player.crouching ? 0.65 : 1.05);
  const baseAngle = player.aimUp ? Math.PI / 2 : player.facing === 1 ? 0 : Math.PI;

  const shoot = (offset: number, speed: number, tint = Tint.commit): void => {
    const angle = baseAngle + offset;
    spawnPlayerBullet(ctx, muzzleX, muzzleY, Math.cos(angle) * speed, Math.sin(angle) * speed, tint);
  };

  switch (state.weapon) {
    case 'heavy':
      shoot(ctx.random.randomFloat(-0.05, 0.05), 27, Tint.heavy);
      player.fireCooldown = 0.075;
      state.ammo -= 1;
      ctx.sfx('shoot_heavy', 0.3, 0.9 + ctx.random.randomFloat(0, 0.2));
      break;
    case 'claude':
      shoot(-0.2, 21, Tint.claude);
      shoot(0, 21, Tint.claude);
      shoot(0.2, 21, Tint.claude);
      player.fireCooldown = 0.24;
      state.ammo -= 1;
      ctx.sfx('claude', 0.35);
      break;
    default:
      shoot(0, 23);
      player.fireCooldown = 0.2;
      ctx.sfx('shoot', 0.3);
  }

  if (state.weapon !== 'commit' && state.ammo <= 0) {
    state.weapon = 'commit';
  }

  player.shootPose = 0.12;
  burst(ctx, ctx.fx.sparks, muzzleX, muzzleY, 2);
}

export function createPlayerSystem(ctx: Ctx): EcsSystem<[PlayerComponent, PositionEcsComponent]> {
  const lastCrouch = new Map<number, boolean>();

  return {
    name: 'hotfix-player',
    query: [playerId, positionId],
    update: (world, { entities, components: [players, positions] }) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);
      const { input, state, cam, assets } = ctx;

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const player = players[i];
        const position = positions[i];
        const flip = world.getComponent<FlipEcsComponent>(entity, flipId);
        const sprite = world.getComponentRequired(entity, spriteId);

        player.invulnerable = Math.max(0, player.invulnerable - dt);
        player.fireCooldown = Math.max(0, player.fireCooldown - dt);
        player.shootPose = Math.max(0, player.shootPose - dt);
        player.jumpBuffer = ctx.press.jump;
        player.grenadeBuffer = ctx.press.grenade;

        // --- Dead: fall, then respawn or end the run ---------------------------
        if (player.dead) {
          player.deadTimer -= dt;
          player.vy = Math.max(MAX_FALL_SPEED, player.vy + GRAVITY * dt);
          position.local.x += player.vx * dt;
          position.local.y = Math.max(0, position.local.y + player.vy * dt);
          setClip(ctx, entity, assets.clip.player_dead, 200);

          if (player.deadTimer <= 0) {
            respawnOrEnd(ctx, player, position);
          }

          continue;
        }

        // --- Move -------------------------------------------------------------------
        const moveX = input.move.value.x;
        const moveY = input.move.value.y;

        player.aimUp = moveY > 0.5;
        player.crouching = moveY < -0.5 && player.onGround;

        if (moveX > 0.2) {
          player.facing = 1;
        } else if (moveX < -0.2) {
          player.facing = -1;
        }

        const targetVx = player.crouching ? 0 : moveX * RUN_SPEED;
        player.vx = approach(player.vx, targetVx, (player.onGround ? 80 : 50) * dt);

        player.coyote = player.onGround ? 0.1 : Math.max(0, player.coyote - dt);

        if (ctx.press.jump > 0 && (player.onGround || player.coyote > 0)) {
          player.vy = JUMP_SPEED;
          player.onGround = false;
          player.coyote = 0;
          ctx.press.jump = 0;
          ctx.sfx('jump', 0.3);
        }

        player.vy = Math.max(MAX_FALL_SPEED, player.vy + GRAVITY * dt);

        const previousY = position.local.y;
        position.local.x += player.vx * dt;
        position.local.y += player.vy * dt;
        position.local.x = clamp(
          position.local.x,
          cam.x - cam.halfWidth + 0.9,
          cam.x + cam.halfWidth - 0.9,
        );

        const landing =
          player.vy <= 0
            ? findLanding(platforms, position.local.x, PLAYER_HALF_WIDTH * 0.7, previousY, position.local.y)
            : null;

        if (landing !== null) {
          if (!player.onGround && player.vy < -8) {
            burst(ctx, ctx.fx.smoke, position.local.x, landing + 0.1, 3);
          }

          position.local.y = landing;
          player.vy = 0;
          player.onGround = true;
        } else {
          player.onGround = false;
        }

        // --- Crouch shrinks the body -------------------------------------------------
        const collider = world.getComponent(entity, colliderId);

        if (collider && lastCrouch.get(entity) !== player.crouching) {
          lastCrouch.set(entity, player.crouching);
          collider.collider = boxCollider(
            PLAYER_HALF_WIDTH * 2,
            player.crouching ? PLAYER_CROUCH_HEIGHT : PLAYER_HEIGHT,
          );
        }

        // --- Shoot and throw -----------------------------------------------------------
        if (input.shoot.isHeld && player.fireCooldown <= 0) {
          fireWeapon(ctx, player, position);
        }

        if (ctx.press.grenade > 0 && state.grenades > 0) {
          ctx.press.grenade = 0;
          state.grenades -= 1;
          spawnGrenade(
            ctx,
            position.local.x + player.facing * 0.8,
            position.local.y + 1.4,
            player.facing * 8.5 + player.vx * 0.3,
            9.5,
          );
          ctx.sfx('grenade', 0.4);
        }

        // --- Presentation -----------------------------------------------------------------
        if (flip) {
          flip.flipX = player.facing === -1;
        }

        sprite.height = player.crouching ? 1.5 : 2;
        sprite.opacityMultiplier = player.invulnerable > 0 && Math.floor(ctx.time.timeInSeconds * 18) % 2 === 0 ? 0.3 : 1;

        if (!player.onGround) {
          setClip(ctx, entity, assets.clip.player_jump, 200);
        } else if (Math.abs(player.vx) > 0.8) {
          setClip(ctx, entity, assets.clip.player_run, 85);
        } else {
          setClip(ctx, entity, assets.clip.player_idle, 420);
        }
      }
    },
  };
}
