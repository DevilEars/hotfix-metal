import {
  addFlipComponent,
  addPositionComponent,
  addScaleComponent,
} from '@forge-game-engine/forge/common';
import { addSpriteAnimationComponent } from '@forge-game-engine/forge/animations';
import { addTextComponent } from '@forge-game-engine/forge/text';
import {
  addLifetimeComponent,
  RemoveFromWorldLifetimeStrategyId,
} from '@forge-game-engine/forge/lifecycle';
import { addColliderComponent, addContactsComponent } from '@forge-game-engine/forge/physics';
import { emitParticleBurst, ParticleEmitter } from '@forge-game-engine/forge/particles';
import {
  addSpriteComponent,
  Color,
  createImageSprite,
  SpriteEcsComponent,
} from '@forge-game-engine/forge/rendering';
import { TextureName } from './assets';
import {
  bossId,
  enemyId,
  EnemyComponent,
  EnemyKind,
  grenadeId,
  hostageId,
  pickupId,
  PickupComponent,
  playerId,
  popupId,
  projectileId,
} from './components';
import {
  Cat,
  Layer,
  PIXELS_PER_UNIT,
  PLAYER_HALF_WIDTH,
  PLAYER_HEIGHT,
  RenderCat,
  Tint,
} from './constants';
import { Ctx } from './ctx';
import { boxCollider } from './physics';

interface SpriteOpts {
  layer: number;
  pivotY?: number;
  tint?: Color;
}

/** Options for a sprite that draws one frame of a sheet. */
export function frameSprite(
  ctx: Ctx,
  texture: TextureName,
  frameWidth: number,
  frameHeight: number,
  opts: SpriteOpts,
): SpriteEcsComponent {
  return {
    ...createImageSprite(ctx.assets.tex[texture], {
      frameDimensions: { x: frameWidth, y: frameHeight },
      pixelsPerUnit: PIXELS_PER_UNIT,
    }),
    pivot: { x: 0.5, y: opts.pivotY ?? 0 },
    category: RenderCat.world,
    layer: opts.layer,
    tintColor: opts.tint ?? Color.white,
  };
}

/** A flat, glowing rectangle (bullets, health bars). */
export function solidSprite(
  ctx: Ctx,
  width: number,
  height: number,
  tint: Color,
  layer: number,
  category: number = RenderCat.world,
): SpriteEcsComponent {
  return {
    texture: ctx.renderContext.whiteTexture,
    width,
    height,
    pivot: { x: 0.5, y: 0.5 },
    tintColor: tint,
    uvOffset: { x: 0, y: 0 },
    uvScale: { x: 1, y: 1 },
    emissive: null,
    material: null,
    category,
    layer,
  };
}

export function burst(
  ctx: Ctx,
  emitter: ParticleEmitter,
  x: number,
  y: number,
  count: number,
): void {
  emitParticleBurst(ctx.world, emitter, { x, y }, ctx.random, { count });
}

export function createFx(ctx: Pick<Ctx, 'renderContext'>): Ctx['fx'] {
  const sprite = (size: number, tint: Color, layer: number): SpriteEcsComponent => ({
    texture: ctx.renderContext.whiteTexture,
    width: size,
    height: size,
    pivot: { x: 0.5, y: 0.5 },
    tintColor: tint,
    uvOffset: { x: 0, y: 0 },
    uvScale: { x: 1, y: 1 },
    emissive: null,
    material: null,
    category: RenderCat.world,
    layer,
  });

  return {
    sparks: new ParticleEmitter(sprite(0.16, Tint.spark, Layer.effect), {
      numParticlesRange: { min: 6, max: 10 },
      speedRange: { min: 4, max: 11 },
      lifetimeSecondsRange: { min: 0.2, max: 0.45 },
      lifetimeOpacity: { start: 1, end: 0 },
      acceleration: { x: 0, y: -18 },
      drag: 0.3,
    }),
    debris: new ParticleEmitter(sprite(0.22, Tint.debris, Layer.effect), {
      numParticlesRange: { min: 8, max: 14 },
      speedRange: { min: 3, max: 12 },
      lifetimeSecondsRange: { min: 0.5, max: 1.0 },
      lifetimeOpacity: { start: 1, end: 0 },
      acceleration: { x: 0, y: -30 },
      drag: 0.5,
    }),
    smoke: new ParticleEmitter(sprite(0.5, new Color(0.35, 0.35, 0.45, 1), Layer.effect), {
      numParticlesRange: { min: 3, max: 5 },
      speedRange: { min: 0.5, max: 2.5 },
      directionRange: { min: Math.PI / 3, max: (2 * Math.PI) / 3 },
      lifetimeSecondsRange: { min: 0.4, max: 0.8 },
      lifetimeOpacity: { start: 0.6, end: 0 },
      lifetimeScaleReduction: 0.5,
    }),
    confetti: new ParticleEmitter(sprite(0.2, Tint.green, Layer.effect), {
      numParticlesRange: { min: 20, max: 28 },
      speedRange: { min: 5, max: 14 },
      directionRange: { min: Math.PI * 0.15, max: Math.PI * 0.85 },
      lifetimeSecondsRange: { min: 0.8, max: 1.6 },
      lifetimeOpacity: { start: 1, end: 0 },
      acceleration: { x: 0, y: -16 },
      drag: 0.6,
    }),
  };
}

// --- Player -------------------------------------------------------------------

export function spawnPlayer(ctx: Ctx, x: number, y: number): number {
  const { world, assets } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x, y } });
  addFlipComponent(world, entity, { flipX: false });
  addSpriteComponent(world, entity, frameSprite(ctx, 'player', 32, 32, { layer: Layer.player }));
  addSpriteAnimationComponent(world, entity, {
    animationClipHandle: assets.clip.player_idle,
    frameDurationMilliseconds: 420,
  });
  addColliderComponent(world, entity, {
    collider: boxCollider(PLAYER_HALF_WIDTH * 2, PLAYER_HEIGHT),
    category: Cat.player,
    mask: Cat.enemy | Cat.enemyBullet | Cat.pickup,
    sensor: true,
  });
  addContactsComponent(world, entity);
  world.addComponent(entity, playerId, {
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    aimUp: false,
    crouching: false,
    fireCooldown: 0,
    jumpBuffer: 0,
    coyote: 0,
    grenadeBuffer: 0,
    invulnerable: 0,
    dead: false,
    deadTimer: 0,
    shootPose: 0,
  });

  return entity;
}

// --- Projectiles ----------------------------------------------------------------

export function spawnPlayerBullet(
  ctx: Ctx,
  x: number,
  y: number,
  vx: number,
  vy: number,
  tint: Color,
): void {
  const { world } = ctx;
  const entity = world.createEntity();
  const vertical = Math.abs(vy) > Math.abs(vx);
  const width = vertical ? 0.16 : 0.6;
  const height = vertical ? 0.6 : 0.16;

  addPositionComponent(world, entity, { local: { x, y } });
  addSpriteComponent(world, entity, solidSprite(ctx, width, height, tint, Layer.bullet));
  addColliderComponent(world, entity, {
    collider: boxCollider(width, height, -height / 2),
    category: Cat.playerBullet,
    mask: Cat.enemy,
    sensor: true,
  });
  addContactsComponent(world, entity);
  addLifetimeComponent(world, entity, { durationSeconds: 1.1 });
  world.addTag(entity, RemoveFromWorldLifetimeStrategyId);
  world.addComponent(entity, projectileId, {
    vx,
    vy,
    damage: 1,
    friendly: true,
    spin: 0,
  });
}

export function spawnEnemyBullet(
  ctx: Ctx,
  x: number,
  y: number,
  vx: number,
  vy: number,
): void {
  const { world } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x, y } });
  addSpriteComponent(world, entity, solidSprite(ctx, 0.34, 0.34, Tint.enemyShot, Layer.bullet));
  addColliderComponent(world, entity, {
    collider: boxCollider(0.3, 0.3, -0.15),
    category: Cat.enemyBullet,
    mask: Cat.player,
    sensor: true,
  });
  addLifetimeComponent(world, entity, { durationSeconds: 5 });
  world.addTag(entity, RemoveFromWorldLifetimeStrategyId);
  world.addComponent(entity, projectileId, {
    vx,
    vy,
    damage: 1,
    friendly: false,
    spin: 0,
  });
}

export function spawnGrenade(ctx: Ctx, x: number, y: number, vx: number, vy: number): void {
  const { world } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x, y } });
  addSpriteComponent(world, entity, solidSprite(ctx, 0.4, 0.4, Tint.grenade, Layer.bullet));
  world.addComponent(entity, grenadeId, { vx, vy, fuse: 1.6 });
}

// --- Effects --------------------------------------------------------------------

export function spawnExplosion(ctx: Ctx, x: number, y: number, scale = 1): void {
  const { world, assets } = ctx;
  const entity = world.createEntity();
  const sprite = frameSprite(ctx, 'explosion', 32, 32, {
    layer: Layer.effect,
    pivotY: 0.5,
    tint: new Color(1.5, 1.35, 1.1, 1),
  });

  addPositionComponent(world, entity, { local: { x, y } });
  addScaleComponent(world, entity, { local: { x: scale, y: scale } });
  addSpriteComponent(world, entity, sprite);
  addSpriteAnimationComponent(world, entity, {
    animationClipHandle: assets.clip.explosion,
    frameDurationMilliseconds: 70,
  });
  addLifetimeComponent(world, entity, { durationSeconds: 0.41 });
  world.addTag(entity, RemoveFromWorldLifetimeStrategyId);

  burst(ctx, ctx.fx.sparks, x, y, Math.round(8 * scale));
  burst(ctx, ctx.fx.debris, x, y, Math.round(6 * scale));
  ctx.cam.shake = Math.max(ctx.cam.shake, 0.15 * scale);
  ctx.sfx('explode', 0.35 + 0.1 * scale, 1.15 - 0.15 * scale);
}

// --- Pickups & hostages -----------------------------------------------------------

const pickupFrame: Record<PickupComponent['kind'], number> = {
  heavy: 0,
  claude: 1,
  grenade: 2,
  coffee: 3,
  points: 4,
};

export function spawnPickup(
  ctx: Ctx,
  kind: PickupComponent['kind'],
  x: number,
  y: number,
  pop = false,
): void {
  const { world } = ctx;
  const entity = world.createEntity();
  const sprite = frameSprite(ctx, 'pickups', 16, 16, { layer: Layer.pickup });

  sprite.uvOffset = { x: pickupFrame[kind] / 5, y: 0 };

  addPositionComponent(world, entity, { local: { x, y } });
  addSpriteComponent(world, entity, sprite);
  addColliderComponent(world, entity, {
    collider: boxCollider(0.9, 0.9),
    category: Cat.pickup,
    mask: Cat.player,
    sensor: true,
  });
  addLifetimeComponent(world, entity, { durationSeconds: 30 });
  world.addTag(entity, RemoveFromWorldLifetimeStrategyId);
  world.addComponent(entity, pickupId, { kind, vy: pop ? 11 : 0, settled: !pop });
}

export function spawnJunior(
  ctx: Ctx,
  x: number,
  y: number,
  reward: PickupComponent['kind'],
): void {
  const { world, assets } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x, y } });
  addFlipComponent(world, entity, { flipX: false });
  addSpriteComponent(world, entity, frameSprite(ctx, 'junior', 32, 32, { layer: Layer.hostage }));
  addSpriteAnimationComponent(world, entity, {
    animationClipHandle: assets.clip.junior_tied,
    frameDurationMilliseconds: 380,
  });
  addColliderComponent(world, entity, {
    collider: boxCollider(1.1, 1.6),
    category: Cat.pickup,
    mask: Cat.player,
    sensor: true,
  });
  world.addComponent(entity, hostageId, { state: 'tied', reward, runDir: 1, timer: 0 });
}

// --- Enemies ----------------------------------------------------------------------

interface EnemySpec {
  texture: TextureName;
  frame: [number, number];
  clip: keyof Ctx['assets']['clip'];
  frameMs: number;
  hp: number;
  score: number;
  width: number;
  height: number;
  speed: number;
}

const enemySpecs: Record<Exclude<EnemyKind, 'boss'>, EnemySpec> = {
  bug: { texture: 'bug', frame: [32, 32], clip: 'bug_walk', frameMs: 120, hp: 1, score: 100, width: 1.2, height: 0.95, speed: 2.8 },
  bot: { texture: 'bot', frame: [32, 32], clip: 'bot_walk', frameMs: 200, hp: 2, score: 200, width: 0.95, height: 1.75, speed: 2.2 },
  fly: { texture: 'fly', frame: [32, 32], clip: 'fly_flap', frameMs: 90, hp: 1, score: 150, width: 1.0, height: 1.0, speed: 3.6 },
  turret: { texture: 'turret', frame: [32, 32], clip: 'turret_idle', frameMs: 300, hp: 7, score: 400, width: 1.7, height: 1.6, speed: 0 },
};

export function spawnEnemy(
  ctx: Ctx,
  kind: Exclude<EnemyKind, 'boss'>,
  x: number,
  y: number,
): number {
  const { world, assets } = ctx;
  const spec = enemySpecs[kind];
  const entity = world.createEntity();
  const flying = kind === 'fly';

  addPositionComponent(world, entity, { local: { x, y } });
  addFlipComponent(world, entity, { flipX: true });
  addSpriteComponent(
    world,
    entity,
    frameSprite(ctx, spec.texture, spec.frame[0], spec.frame[1], { layer: Layer.enemy }),
  );
  addSpriteAnimationComponent(world, entity, {
    animationClipHandle: assets.clip[spec.clip],
    frameDurationMilliseconds: spec.frameMs,
  });
  addColliderComponent(world, entity, {
    collider: boxCollider(spec.width, spec.height, flying ? 0.1 : 0),
    category: Cat.enemy,
    mask: Cat.player | Cat.playerBullet,
    sensor: true,
  });

  const enemy: EnemyComponent = {
    kind,
    hp: spec.hp,
    maxHp: spec.hp,
    score: spec.score,
    vx: 0,
    vy: 0,
    dir: -1,
    time: ctx.random.randomFloat(0, 6),
    timer: ctx.random.randomFloat(0.6, 1.8),
    baseY: y,
    state: kind === 'turret' ? 'idle' : 'walk',
    flash: 0,
    shots: 0,
  };
  world.addComponent(entity, enemyId, enemy);

  return entity;
}

export function spawnBoss(ctx: Ctx, x: number): number {
  const { world } = ctx;
  const entity = world.createEntity();
  const hp = 70;

  addPositionComponent(world, entity, { local: { x, y: 0 } });
  addFlipComponent(world, entity, { flipX: false });
  addSpriteComponent(world, entity, frameSprite(ctx, 'boss', 96, 96, { layer: Layer.boss }));
  addSpriteAnimationComponent(world, entity, {
    animationClipHandle: ctx.assets.clip.boss_idle,
    frameDurationMilliseconds: 300,
  });
  addColliderComponent(world, entity, {
    collider: boxCollider(4.8, 5.4),
    category: Cat.enemy,
    mask: Cat.player | Cat.playerBullet,
    sensor: true,
  });
  world.addComponent(entity, enemyId, {
    kind: 'boss',
    hp,
    maxHp: hp,
    score: 5000,
    vx: 0,
    vy: 0,
    dir: -1,
    time: 0,
    timer: 2,
    baseY: 0,
    state: 'idle',
    flash: 0,
    shots: 0,
  } satisfies EnemyComponent);
  world.addComponent(entity, bossId, { phase: 1, attackTimer: 2.2, pattern: 0, entered: false });

  ctx.state.bossActive = true;
  ctx.state.bossHp = hp;
  ctx.state.bossMaxHp = hp;

  return entity;
}

// --- Floating score text -----------------------------------------------------------

export function spawnPopup(ctx: Ctx, x: number, y: number, text: string, color: Color): void {
  const { world } = ctx;
  const entity = world.createEntity();

  // The text is centred in a 6-unit box that starts at the entity position.
  addPositionComponent(world, entity, { local: { x: x - 3, y } });
  addTextComponent(world, entity, {
    text,
    fontAtlas: ctx.assets.font,
    size: 0.5,
    color,
    outlineColor: new Color(0.05, 0.06, 0.15, 1),
    outlineWidth: 2,
    category: RenderCat.world,
    layer: Layer.effect + 1,
    horizontalAlign: 'center',
    maxWidth: 6,
    horizontalAlignPivot: 0,
  });
  addLifetimeComponent(world, entity, { durationSeconds: 0.9 });
  world.addTag(entity, RemoveFromWorldLifetimeStrategyId);
  world.addComponent(entity, popupId, { vy: 2.6 });
}
