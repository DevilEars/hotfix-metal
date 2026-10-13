import { createTransformEcsSystem, positionId } from '@forge-game-engine/forge/common';
import { createSpriteAnimationEcsSystem } from '@forge-game-engine/forge/animations';
import { playSound } from '@forge-game-engine/forge/audio';
import {
  createLifetimeTrackingEcsSystem,
  createRemoveFromWorldEcsSystem,
} from '@forge-game-engine/forge/lifecycle';
import { createAgeScaleEcsSystem } from '@forge-game-engine/forge/common';
import { Random } from '@forge-game-engine/forge/math';
import {
  buttonMoments,
  HoldAction,
  Axis2dAction,
  KeyboardAxis2dBinding,
  KeyboardHoldBinding,
  KeyboardInputSource,
  KeyboardTriggerBinding,
  keyCodes,
  mouseButtons,
  MouseHoldBinding,
  MouseInputSource,
  registerInputs,
  TriggerAction,
} from '@forge-game-engine/forge/input';
import {
  createBroadPhaseEcsSystem,
  createNarrowPhaseEcsSystem,
  CollisionManifold,
  CollisionPair,
} from '@forge-game-engine/forge/physics';
import {
  createParticleEcsSystem,
  createParticleOpacityEcsSystem,
  createParticlePositionEcsSystem,
} from '@forge-game-engine/forge/particles';
import {
  addBloomComponent,
  Color,
  createBloomEcsSystem,
  createCamera,
  createPresentEcsSystem,
  createRenderEcsSystem,
  createRenderTarget,
  RENDER_TARGET_FORMAT,
} from '@forge-game-engine/forge/rendering';
import { createTextShapingEcsSystem } from '@forge-game-engine/forge/text';
import { createGame, Game } from '@forge-game-engine/forge/utilities';
import { loadAssets } from './assets';
import {
  bossId,
  enemyId,
  grenadeId,
  hostageId,
  pickupId,
  playerId,
  popupId,
  projectileId,
} from './components';
import { BOSS_ARENA_CENTER, CAMERA_Y, RenderCat, VIEW_HEIGHT } from './constants';
import { Ctx, makeSfx } from './ctx';
import { createHud, createHudSystem } from './hud';
import { juniorsInLevel } from './level';
import { resetGameState, createGameState } from './state';
import { createFx, spawnPlayer } from './spawn';
import {
  createGrenadeSystem,
  createHostageSystem,
  createPickupSystem,
  createPopupSystem,
  createProjectileSystem,
} from './systems/actors';
import { createCameraRigSystem, createFollowCameraSystem, createParallaxSystem } from './systems/camera';
import { createSignFlickerSystem } from './systems/signs';
import { createBulletHitSystem, createPlayerContactSystem } from './systems/collisions';
import { createEnemySystem } from './systems/enemies';
import { createFlowSystem, orderedScript } from './systems/flow';
import { createPlayerSystem } from './systems/player';
import { buildWorld } from './world';

export interface HotfixGame {
  game: Game;
  ctx: Ctx;
}

export interface GameCallbacks {
  onGameOver: () => void;
  onVictory: () => void;
}

export async function createHotfixGame(callbacks: GameCallbacks): Promise<HotfixGame> {
  const { game, world, renderContext, time } = createGame('game-container');
  const assets = await loadAssets(renderContext);

  // Three layers: parallax backdrop, the world (HDR, so bullets bloom) and the HUD.
  const backgroundTarget = createRenderTarget(renderContext, 'canvas');
  const worldTarget = createRenderTarget(renderContext, 'canvas', RENDER_TARGET_FORMAT.hdr);
  const uiTarget = createRenderTarget(renderContext, 'canvas');

  const background = createCamera(world, {
    cullingMask: RenderCat.background,
    renderTarget: backgroundTarget,
    layer: 0,
    verticalWorldUnits: VIEW_HEIGHT,
    isStatic: true,
    clearColor: new Color(0.03, 0.04, 0.1, 1),
  });
  const worldCamera = createCamera(world, {
    cullingMask: RenderCat.world,
    renderTarget: worldTarget,
    layer: 1,
    verticalWorldUnits: VIEW_HEIGHT,
    isStatic: true,
  });
  const ui = createCamera(world, {
    cullingMask: RenderCat.ui,
    renderTarget: uiTarget,
    layer: 2,
    verticalWorldUnits: VIEW_HEIGHT,
    isStatic: true,
  });

  addBloomComponent(world, worldCamera, { threshold: 0.92, passes: 5, intensity: 1.15 });

  // Inputs ------------------------------------------------------------------------
  const move = new Axis2dAction('move');
  const shoot = new HoldAction('shoot');
  const jump = new TriggerAction('jump');
  const grenade = new TriggerAction('grenade');
  const inputManager = registerInputs(world, time, {
    axis2dActions: [move],
    holdActions: [shoot],
    triggerActions: [jump, grenade],
  });
  const keyboard = new KeyboardInputSource(inputManager);
  const mouse = new MouseInputSource(inputManager, game.container);

  for (const keys of [
    [keyCodes.w, keyCodes.s, keyCodes.d, keyCodes.a],
    [keyCodes.arrowUp, keyCodes.arrowDown, keyCodes.arrowRight, keyCodes.arrowLeft],
  ]) {
    keyboard.axis2dBindings.add(new KeyboardAxis2dBinding(move, keys[0], keys[1], keys[2], keys[3]));
  }

  for (const key of [keyCodes.j, keyCodes.x]) {
    keyboard.holdBindings.add(new KeyboardHoldBinding(shoot, key));
  }

  mouse.holdBindings.add(new MouseHoldBinding(shoot, mouseButtons.left));

  for (const key of [keyCodes.k, keyCodes.z, keyCodes.space]) {
    keyboard.triggerBindings.add(new KeyboardTriggerBinding(jump, key, buttonMoments.down));
  }

  for (const key of [keyCodes.l, keyCodes.c]) {
    keyboard.triggerBindings.add(new KeyboardTriggerBinding(grenade, key, buttonMoments.down));
  }

  // Shared context ---------------------------------------------------------------
  const state = createGameState();
  state.juniorsTotal = juniorsInLevel;

  const ctx: Ctx = {
    world,
    renderContext,
    time,
    random: new Random(),
    state,
    assets,
    input: { move, shoot, jump, grenade },
    cam: {
      x: 0,
      halfWidth: 13.3,
      halfHeight: VIEW_HEIGHT / 2,
      shake: 0,
      maxX: BOSS_ARENA_CENTER,
      background,
      world: worldCamera,
      ui,
    },
    fx: undefined as never,
    player: -1,
    nextSpawn: 0,
    muted: false,
    press: { jump: 0, grenade: 0 },
    onGameOver: callbacks.onGameOver,
    onVictory: callbacks.onVictory,
    sfx: undefined as never,
    restart: undefined as never,
  };

  ctx.fx = createFx(ctx);
  ctx.sfx = makeSfx(() => ctx);

  jump.triggerEvent.registerListener(() => {
    ctx.press.jump = 0.14;
  });
  grenade.triggerEvent.registerListener(() => {
    ctx.press.grenade = 0.14;
  });

  let musicStarted = false;

  ctx.restart = () => {
    for (const key of [playerId, enemyId, projectileId, grenadeId, pickupId, hostageId, popupId, bossId]) {
      const found = world.query([key]);
      for (const entity of found.entities) {
        if (world.isAlive(entity)) {
          world.removeEntity(entity);
        }
      }
    }

    resetGameState(state);
    state.juniorsTotal = juniorsInLevel;
    ctx.nextSpawn = 0;
    ctx.cam.x = 0;
    ctx.cam.shake = 0;
    ctx.press.jump = 0;
    ctx.press.grenade = 0;
    ctx.player = spawnPlayer(ctx, 3, 7);

    // Handy for demos and testing: ?start=zone2 | zone3 | boss
    const start = new URLSearchParams(window.location.search).get('start');
    const startX = start === 'zone2' ? 90 : start === 'zone3' ? 195 : start === 'boss' ? BOSS_ARENA_CENTER - 3 : 0;

    if (startX > 0) {
      ctx.cam.x = startX;
      world.getComponentRequired(ctx.player, positionId).local.x = start === 'boss' ? startX + 2 : startX - 5;
      ctx.nextSpawn =
        start === 'boss'
          ? orderedScript.findIndex((entry) => entry.kind === 'boss')
          : Math.max(0, orderedScript.findIndex((entry) => entry.kind !== 'boss' && entry.trigger > startX + 14));
    }

    if (!musicStarted) {
      musicStarted = true;
      try {
        playSound(assets.musicBus, assets.music, { loop: true, volume: 0.32 });
      } catch {
        // Music is a nice-to-have.
      }
    }
  };

  // World content ------------------------------------------------------------------
  buildWorld(ctx);
  createHud(ctx);

  // Systems (order matters: gameplay -> transform -> render -> physics -> hits) ---------
  const playing = (): boolean => ctx.state.phase === 'playing';
  const collisionPairs: CollisionPair[] = [];
  const collisionManifolds: CollisionManifold[] = [];

  world.addSystem(createFlowSystem(ctx));
  world.addSystem(createPlayerSystem(ctx), { runIf: playing });
  world.addSystem(createEnemySystem(ctx), { runIf: playing });
  world.addSystem(createProjectileSystem(ctx), { runIf: playing });
  world.addSystem(createGrenadeSystem(ctx), { runIf: playing });
  world.addSystem(createPickupSystem(ctx), { runIf: playing });
  world.addSystem(createHostageSystem(ctx), { runIf: playing });
  world.addSystem(createPopupSystem(ctx));
  world.addSystem(createCameraRigSystem(ctx));
  world.addSystem(createParallaxSystem(ctx));
  world.addSystem(createSignFlickerSystem(ctx));
  world.addSystem(createFollowCameraSystem(ctx));
  world.addSystem(createHudSystem(ctx));

  world.addSystem(createParticleEcsSystem(time, ctx.random));
  world.addSystem(createParticlePositionEcsSystem(time));
  world.addSystem(createLifetimeTrackingEcsSystem(time));
  world.addSystem(createAgeScaleEcsSystem());
  world.addSystem(createParticleOpacityEcsSystem());
  world.addSystem(createRemoveFromWorldEcsSystem());
  world.addSystem(createSpriteAnimationEcsSystem(time, assets.clips));

  world.addSystem(createTransformEcsSystem());
  world.addSystem(createTextShapingEcsSystem());
  world.addSystem(createRenderEcsSystem(renderContext));
  world.addSystem(createBloomEcsSystem(renderContext));
  world.addSystem(createPresentEcsSystem(renderContext));

  world.addSystem(createBroadPhaseEcsSystem(collisionPairs));
  world.addSystem(createNarrowPhaseEcsSystem(collisionPairs, collisionManifolds));
  world.addSystem(createBulletHitSystem(ctx), { runIf: playing });
  world.addSystem(createPlayerContactSystem(ctx), { runIf: playing });

  // Make the title card's backdrop camera valid before the first frame.
  world.getComponentRequired(background, positionId).local.y = CAMERA_Y;
  world.getComponentRequired(worldCamera, positionId).local.y = CAMERA_Y;

  return { game, ctx };
}
