import { EcsWorld } from '@forge-game-engine/forge/ecs';
import { Time } from '@forge-game-engine/forge/common';
import { Random } from '@forge-game-engine/forge/math';
import { RenderContext } from '@forge-game-engine/forge/rendering';
import { Axis2dAction, HoldAction, TriggerAction } from '@forge-game-engine/forge/input';
import { ParticleEmitter } from '@forge-game-engine/forge/particles';
import { playSound } from '@forge-game-engine/forge/audio';
import { Assets, SfxName } from './assets';
import { GameState } from './state';

export interface Inputs {
  move: Axis2dAction;
  shoot: HoldAction;
  jump: TriggerAction;
  grenade: TriggerAction;
}

export interface CameraRig {
  /** Centre of the (unshaken) view. */
  x: number;
  halfWidth: number;
  halfHeight: number;
  shake: number;
  /** Furthest right the camera may scroll. */
  maxX: number;
  background: number;
  world: number;
  ui: number;
}

export interface Fx {
  sparks: ParticleEmitter;
  debris: ParticleEmitter;
  smoke: ParticleEmitter;
  confetti: ParticleEmitter;
}

export interface Ctx {
  world: EcsWorld;
  renderContext: RenderContext;
  time: Time;
  random: Random;
  state: GameState;
  assets: Assets;
  input: Inputs;
  cam: CameraRig;
  fx: Fx;
  /** The player's entity, or -1 between lives. */
  player: number;
  /** Index into the spawn script of the next entry to fire. */
  nextSpawn: number;
  muted: boolean;
  /** Seconds a jump / grenade press stays buffered (set by input events). */
  press: { jump: number; grenade: number };
  onGameOver: () => void;
  onVictory: () => void;
  sfx: (name: SfxName, volume?: number, rate?: number) => void;
  /** Restart the run (called from the title/game-over screens). */
  restart: () => void;
}

export function makeSfx(ctx: () => Ctx): Ctx['sfx'] {
  return (name, volume = 0.5, rate = 1) => {
    const c = ctx();
    if (c.muted) {
      return;
    }
    try {
      playSound(c.assets.sfxBus, c.assets.sounds[name], { volume, rate });
    } catch {
      // Audio can be unavailable (autoplay policy, stopped mixer): never fatal.
    }
  };
}
