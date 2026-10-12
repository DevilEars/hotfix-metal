import { positionId, PositionEcsComponent } from '@forge-game-engine/forge/common';
import { EcsSystem } from '@forge-game-engine/forge/ecs';
import { getCameraView } from '@forge-game-engine/forge/rendering';
import { clamp } from '@forge-game-engine/forge/math';
import { followCameraId, FollowCameraComponent, ParallaxComponent, parallaxId } from '../components';
import { CAMERA_Y, VIEW_HEIGHT } from '../constants';
import { Ctx } from '../ctx';
import { currentPlayer } from './combat';

/** Scrolls the camera like an arcade cabinet: forward only, with shake. */
export function createCameraRigSystem(ctx: Ctx): EcsSystem<[]> {
  let attractDirection = 1;

  return {
    name: 'hotfix-camera',
    query: [],
    update: (world) => {
      const dt = Math.min(ctx.time.deltaTimeInSeconds, 1 / 30);
      const { cam, state } = ctx;
      const view = getCameraView(world, cam.world, ctx.renderContext).size;

      cam.halfWidth = view.x / 2;
      cam.halfHeight = VIEW_HEIGHT / 2;

      if (state.phase === 'title') {
        // Attract mode: drift across the first zone behind the title card.
        cam.x += attractDirection * 2.4 * dt;

        if (cam.x > 52) {
          attractDirection = -1;
        } else if (cam.x < cam.halfWidth) {
          attractDirection = 1;
        }
      } else {
        const target = currentPlayer(ctx);

        if (target && !target.player.dead) {
          const wanted = target.position.local.x + 3;

          if (wanted > cam.x) {
            cam.x += (wanted - cam.x) * Math.min(1, 6 * dt);
          }
        }
      }

      cam.x = clamp(cam.x, cam.halfWidth, Math.max(cam.halfWidth, cam.maxX));
      cam.shake = Math.max(0, cam.shake - dt * 1.1);

      const sx = (ctx.random.randomFloat(0, 1) - 0.5) * 2 * cam.shake;
      const sy = (ctx.random.randomFloat(0, 1) - 0.5) * 2 * cam.shake;

      const background = world.getComponentRequired(cam.background, positionId);
      const worldCamera = world.getComponentRequired(cam.world, positionId);
      background.local.x = cam.x;
      background.local.y = CAMERA_Y;
      worldCamera.local.x = cam.x + sx;
      worldCamera.local.y = CAMERA_Y + sy;
    },
  };
}

const BACKGROUND_BOTTOM = CAMERA_Y - VIEW_HEIGHT / 2;

/** Tiles that scroll at a fraction of the camera speed. */
export function createParallaxSystem(ctx: Ctx): EcsSystem<[ParallaxComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-parallax',
    query: [parallaxId, positionId],
    update: (_world, { components: [layers, positions] }) => {
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const shift = (ctx.cam.x * layer.factor) % layer.tileWidth;

        positions[i].local.x = ctx.cam.x - shift + (layer.index - 1) * layer.tileWidth + layer.tileWidth / 2;
        positions[i].local.y = BACKGROUND_BOTTOM;
      }
    },
  };
}

/** Sprites pinned to the camera (the sky). */
export function createFollowCameraSystem(ctx: Ctx): EcsSystem<[FollowCameraComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-follow-camera',
    query: [followCameraId, positionId],
    update: (_world, { components: [followers, positions] }) => {
      for (let i = 0; i < followers.length; i++) {
        positions[i].local.x = ctx.cam.x + followers[i].offsetX;
        positions[i].local.y = BACKGROUND_BOTTOM;
      }
    },
  };
}
