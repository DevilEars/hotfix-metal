import { START_LIVES } from './constants';

export type Phase = 'title' | 'playing' | 'gameover' | 'victory';
export type WeaponKind = 'commit' | 'heavy' | 'claude';

export interface GameState {
  phase: Phase;
  score: number;
  lives: number;
  weapon: WeaponKind;
  ammo: number;
  grenades: number;
  rescued: number;
  juniorsTotal: number;
  /** Zone banner shown at the top of the screen. */
  banner: string;
  bannerSeconds: number;
  bossActive: boolean;
  bossHp: number;
  bossMaxHp: number;
  /** Seconds since the run started (also freezes on win). */
  runSeconds: number;
  /** Kills for the end-of-run report. */
  bugsSquashed: number;
}

export function createGameState(): GameState {
  return {
    phase: 'title',
    score: 0,
    lives: START_LIVES,
    weapon: 'commit',
    ammo: 0,
    grenades: 5,
    rescued: 0,
    juniorsTotal: 0,
    banner: '',
    bannerSeconds: 0,
    bossActive: false,
    bossHp: 0,
    bossMaxHp: 1,
    runSeconds: 0,
    bugsSquashed: 0,
  };
}

export function resetGameState(state: GameState): void {
  Object.assign(state, createGameState(), { phase: 'playing' as Phase });
}

export function showBanner(state: GameState, text: string, seconds = 3): void {
  state.banner = text;
  state.bannerSeconds = seconds;
}
