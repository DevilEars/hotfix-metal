import { createComponentId } from '@forge-game-engine/forge/ecs';
import type { Color } from '@forge-game-engine/forge/rendering';

export type EnemyKind = 'bug' | 'bot' | 'fly' | 'turret' | 'boss';

export interface PlayerComponent {
  vx: number;
  vy: number;
  onGround: boolean;
  facing: 1 | -1;
  aimUp: boolean;
  crouching: boolean;
  fireCooldown: number;
  jumpBuffer: number;
  coyote: number;
  grenadeBuffer: number;
  invulnerable: number;
  dead: boolean;
  deadTimer: number;
  /** Seconds until the muzzle flash stops showing the "shoot" pose. */
  shootPose: number;
}

export interface EnemyComponent {
  kind: EnemyKind;
  hp: number;
  maxHp: number;
  score: number;
  vx: number;
  vy: number;
  dir: 1 | -1;
  time: number;
  timer: number;
  baseY: number;
  state: 'walk' | 'aim' | 'shoot' | 'idle';
  flash: number;
  /** Shots left in the current burst (turrets, boss). */
  shots: number;
}

export interface ProjectileComponent {
  vx: number;
  vy: number;
  damage: number;
  friendly: boolean;
  spin: number;
}

export interface GrenadeComponent {
  vx: number;
  vy: number;
  fuse: number;
}

export interface PickupComponent {
  kind: 'heavy' | 'claude' | 'grenade' | 'coffee' | 'points';
  vy: number;
  settled: boolean;
}

export interface HostageComponent {
  state: 'tied' | 'free';
  reward: PickupComponent['kind'];
  runDir: 1 | -1;
  timer: number;
}

export interface BossComponent {
  phase: 1 | 2;
  attackTimer: number;
  pattern: number;
  entered: boolean;
}

export interface HudComponent {
  slot: string;
  anchor: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'banner' | 'boss';
  offsetX: number;
  offsetY: number;
}

/** A background layer that scrolls at a fraction of the camera speed. */
export interface ParallaxComponent {
  factor: number;
  tileWidth: number;
  index: number;
}

/** Follows the camera horizontally (sky, stars). */
export interface FollowCameraComponent {
  offsetX: number;
}

export const playerId = createComponentId<PlayerComponent>('hm-player');
export const enemyId = createComponentId<EnemyComponent>('hm-enemy');
export const projectileId = createComponentId<ProjectileComponent>('hm-projectile');
export const grenadeId = createComponentId<GrenadeComponent>('hm-grenade');
export const pickupId = createComponentId<PickupComponent>('hm-pickup');
export const hostageId = createComponentId<HostageComponent>('hm-hostage');
export const bossId = createComponentId<BossComponent>('hm-boss');
export const hudId = createComponentId<HudComponent>('hm-hud');
export const parallaxId = createComponentId<ParallaxComponent>('hm-parallax');
export const followCameraId = createComponentId<FollowCameraComponent>('hm-follow-camera');

export interface PopupComponent {
  vy: number;
}
export const popupId = createComponentId<PopupComponent>('hm-popup');

/** Neon sign text that flickers (tubes) or blinks (warning boards). */
export interface SignFlickerComponent {
  mode: 'flicker' | 'blink';
  /** The text colour at full brightness. */
  base: Color;
  /** Seconds left in the current dim moment (flicker mode). */
  dim: number;
  /** Per-sign offset so signs don't pulse in sync. */
  phase: number;
}
export const signFlickerId = createComponentId<SignFlickerComponent>('hm-sign-flicker');
