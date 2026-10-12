import { positionId, PositionEcsComponent } from '@forge-game-engine/forge/common';
import { EcsSystem } from '@forge-game-engine/forge/ecs';
import { ContactsEcsComponent, contactsId } from '@forge-game-engine/forge/physics';
import {
  enemyId,
  hostageId,
  pickupId,
  PlayerComponent,
  playerId,
  ProjectileComponent,
  projectileId,
} from '../components';
import { Ctx } from '../ctx';
import { burst } from '../spawn';
import { collectPickup, damageEnemy, killPlayer, rescueJunior } from './combat';

/** Player bullets that touched an enemy this tick. */
export function createBulletHitSystem(
  ctx: Ctx,
): EcsSystem<[ProjectileComponent, ContactsEcsComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-bullet-hits',
    query: [projectileId, contactsId, positionId],
    update: (world, { entities, components: [projectiles, contacts, positions] }) => {
      for (let i = 0; i < entities.length; i++) {
        if (!projectiles[i].friendly || !world.isAlive(entities[i])) {
          continue;
        }

        for (const other of contacts[i].touching) {
          if (world.isAlive(other) && world.getComponent(other, enemyId)) {
            damageEnemy(ctx, other, projectiles[i].damage);
            burst(ctx, ctx.fx.sparks, positions[i].local.x, positions[i].local.y, 4);
            world.removeEntity(entities[i]);
            break;
          }
        }
      }
    },
  };
}

/** Everything the player touched this tick: pickups, hostages, danger. */
export function createPlayerContactSystem(
  ctx: Ctx,
): EcsSystem<[PlayerComponent, ContactsEcsComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-player-contacts',
    query: [playerId, contactsId, positionId],
    update: (world, { components: [players, contacts, positions] }) => {
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const position = positions[i];

        if (player.dead) {
          continue;
        }

        for (const other of contacts[i].touching) {
          if (!world.isAlive(other)) {
            continue;
          }

          const pickup = world.getComponent(other, pickupId);

          if (pickup) {
            const pickupPosition = world.getComponent(other, positionId);
            if (pickupPosition) {
              collectPickup(ctx, other, pickup, pickupPosition);
            }
            continue;
          }

          const hostage = world.getComponent(other, hostageId);

          if (hostage) {
            const hostagePosition = world.getComponent(other, positionId);
            if (hostagePosition) {
              rescueJunior(ctx, other, hostage, hostagePosition);
            }
            continue;
          }

          const enemy = world.getComponent(other, enemyId);
          const projectile = world.getComponent(other, projectileId);

          if ((enemy && enemy.hp > 0) || (projectile && !projectile.friendly)) {
            if (projectile) {
              world.removeEntity(other);
            }

            killPlayer(ctx, player, position);
            break;
          }
        }
      }
    },
  };
}
