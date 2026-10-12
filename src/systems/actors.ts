import { flipId, positionId, PositionEcsComponent } from '@forge-game-engine/forge/common';
import { EcsSystem } from '@forge-game-engine/forge/ecs';

import { textId } from '@forge-game-engine/forge/text';
import {
  EnemyComponent,
  enemyId,
  GrenadeComponent,
  grenadeId,
  HostageComponent,
  hostageId,
  PickupComponent,
  pickupId,
  PopupComponent,
  popupId,
  ProjectileComponent,
  projectileId,
} from '../components';
import { GRAVITY } from '../constants';
import { Ctx } from '../ctx';
import { platforms } from '../level';
import { findLanding } from '../physics';
import { burst, spawnExplosion } from '../spawn';
import { setClip } from './player';
import { damageEnemy } from './combat';

export function createProjectileSystem(ctx: Ctx): EcsSystem<[ProjectileComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-projectiles',
    query: [projectileId, positionId],
    update: (world, { entities, components: [projectiles, positions] }) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);
      const { cam } = ctx;

      for (let i = 0; i < entities.length; i++) {
        const projectile = projectiles[i];
        const position = positions[i];

        position.local.x += projectile.vx * dt;
        position.local.y += projectile.vy * dt;

        const outside =
          position.local.x < cam.x - cam.halfWidth - 3 ||
          position.local.x > cam.x + cam.halfWidth + 3 ||
          position.local.y > 20 ||
          position.local.y < 0;

        if (outside) {
          if (position.local.y < 0 && position.local.x > cam.x - cam.halfWidth && position.local.x < cam.x + cam.halfWidth) {
            burst(ctx, ctx.fx.sparks, position.local.x, 0.1, 3);
          }

          world.removeEntity(entities[i]);
        }
      }
    },
  };
}

const grenadeRadius = 3.4;

export function createGrenadeSystem(ctx: Ctx): EcsSystem<[GrenadeComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-grenades',
    query: [grenadeId, positionId],
    update: (world, { entities, components: [grenades, positions] }) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const grenade = grenades[i];
        const position = positions[i];

        grenade.vy += GRAVITY * 0.7 * dt;
        const previousY = position.local.y;
        position.local.x += grenade.vx * dt;
        position.local.y += grenade.vy * dt;
        grenade.fuse -= dt;

        let detonate = grenade.fuse <= 0;
        const landing = grenade.vy <= 0 ? findLanding(platforms, position.local.x, 0.1, previousY, position.local.y) : null;

        if (landing !== null) {
          detonate = true;
        }

        if (!detonate) {
          // Explodes on touching any enemy too.
          const enemyEntities = world.query<[EnemyComponent, PositionEcsComponent]>([enemyId, positionId]);
          for (let k = 0; k < enemyEntities.entities.length; k++) {
            const ep = enemyEntities.components[1][k];
            if (Math.abs(ep.local.x - position.local.x) < 0.9 && position.local.y > ep.local.y && position.local.y < ep.local.y + 2.2) {
              detonate = true;
              break;
            }
          }
        }

        if (!detonate) {
          continue;
        }

        const x = position.local.x;
        const y = Math.max(position.local.y, 0.6);
        world.removeEntity(entity);
        spawnExplosion(ctx, x, y, 2.2);
        ctx.cam.shake = Math.max(ctx.cam.shake, 0.4);

        const victims = world.query<[EnemyComponent, PositionEcsComponent]>([enemyId, positionId]);
        for (let k = 0; k < victims.entities.length; k++) {
          const vp = victims.components[1][k];
          const distance = Math.hypot(vp.local.x - x, vp.local.y + 0.9 - y);

          if (distance < grenadeRadius) {
            damageEnemy(ctx, victims.entities[k], victims.components[0][k].kind === 'boss' ? 4 : 5);
          }
        }
      }
    },
  };
}

export function createPickupSystem(ctx: Ctx): EcsSystem<[PickupComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-pickups',
    query: [pickupId, positionId],
    update: (_world, { components: [pickups, positions] }) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);

      for (let i = 0; i < pickups.length; i++) {
        const pickup = pickups[i];
        const position = positions[i];

        if (pickup.settled) {
          continue;
        }

        pickup.vy += GRAVITY * 0.8 * dt;
        const previousY = position.local.y;
        position.local.y += pickup.vy * dt;

        const landing = pickup.vy <= 0 ? findLanding(platforms, position.local.x, 0.3, previousY, position.local.y) : null;

        if (landing !== null) {
          position.local.y = landing;
          pickup.settled = true;
        }
      }
    },
  };
}

export function createHostageSystem(ctx: Ctx): EcsSystem<[HostageComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-hostages',
    query: [hostageId, positionId],
    update: (world, { entities, components: [hostages, positions] }) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        const hostage = hostages[i];
        const position = positions[i];

        if (hostage.state === 'free') {
          hostage.timer -= dt;
          position.local.x += hostage.runDir * 5 * dt;
          const flip = world.getComponent(entity, flipId);

          if (flip) {
            flip.flipX = hostage.runDir === -1;
          }

          setClip(ctx, entity, ctx.assets.clip.junior_free, 110);

          if (hostage.timer <= 0) {
            world.removeEntity(entity);
          }
        }
      }
    },
  };
}

export function createPopupSystem(ctx: Ctx): EcsSystem<[PopupComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-popups',
    query: [popupId, positionId],
    update: (world, { entities, components: [popups, positions] }) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);

      for (let i = 0; i < entities.length; i++) {
        const popup = popups[i];
        positions[i].local.y += popup.vy * dt;
        popup.vy = Math.max(0.4, popup.vy - 4 * dt);
        const text = world.getComponent(entities[i], textId);

        if (text) {
          text.opacityMultiplier = Math.max(0, (text.opacityMultiplier ?? 1) - dt * 1.1);
        }
      }
    },
  };
}


