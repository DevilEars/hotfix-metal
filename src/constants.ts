import { Color } from '@forge-game-engine/forge/rendering';

/** Height of the world the cameras show, in world units (16 px art => 240 px). */
export const VIEW_HEIGHT = 15;
export const PIXELS_PER_UNIT = 16;
/** World Y of the camera centre: ground (y = 0) sits near the bottom. */
export const CAMERA_Y = 6;
export const LEVEL_WIDTH = 276;
export const BOSS_ARENA_CENTER = 246;

export const GRAVITY = -54;
export const MAX_FALL_SPEED = -30;
export const RUN_SPEED = 7.2;
export const JUMP_SPEED = 20.5;
export const PLAYER_HALF_WIDTH = 0.42;
export const PLAYER_HEIGHT = 1.55;
export const PLAYER_CROUCH_HEIGHT = 1.0;
export const START_LIVES = 3;
export const RESPAWN_INVULNERABLE_SECONDS = 2.6;

/** Collision categories (physics module). */
export const Cat = {
  player: 1 << 0,
  playerBullet: 1 << 1,
  enemy: 1 << 2,
  enemyBullet: 1 << 3,
  pickup: 1 << 4,
} as const;

/** Which camera draws a sprite. */
export const RenderCat = {
  background: 1 << 0,
  world: 1 << 1,
  ui: 1 << 2,
} as const;

/** Draw order inside a camera (higher draws on top). */
export const Layer = {
  sky: 0,
  stars: 1,
  skylineFar: 2,
  skylineNear: 3,
  billboard: 0,
  ground: 1,
  platform: 2,
  pickup: 3,
  hostage: 3,
  enemy: 4,
  boss: 4,
  player: 6,
  bullet: 7,
  effect: 8,
} as const;

/** HDR tints (> 1 blooms). */
export const Tint = {
  commit: new Color(2.6, 2.3, 0.8, 1),
  heavy: new Color(3, 1.6, 0.4, 1),
  claude: new Color(3, 1.4, 0.9, 1),
  enemyShot: new Color(3, 0.5, 0.6, 1),
  grenade: new Color(0.8, 1.6, 0.9, 1),
  spark: new Color(2.5, 2, 1, 1),
  debris: new Color(0.5, 0.55, 0.7, 1),
  green: new Color(0.6, 2.4, 1.2, 1),
} as const;
