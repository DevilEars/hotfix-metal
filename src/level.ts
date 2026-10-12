import { BOSS_ARENA_CENTER } from './constants';

export interface Platform {
  /** Left edge. */
  x: number;
  /** Top surface height. */
  y: number;
  width: number;
}

/** One-way server-rack platforms the player can jump up onto. */
export const platforms: Platform[] = [
  // Zone 1: Legacy Codebase
  { x: 22, y: 3.2, width: 6 },
  { x: 43, y: 3, width: 8 },
  { x: 60, y: 3.3, width: 6 },
  { x: 70, y: 2.4, width: 10 },
  // Zone 2: Merge Conflict Canyon
  { x: 98, y: 3, width: 8 },
  { x: 109, y: 5.4, width: 6 },
  { x: 126, y: 3, width: 10 },
  { x: 139, y: 4.6, width: 7 },
  { x: 154, y: 3, width: 12 },
  { x: 169, y: 5, width: 8 },
  // Zone 3: Production
  { x: 200, y: 3, width: 7 },
  { x: 214, y: 3.4, width: 7 },
  { x: BOSS_ARENA_CENTER - 11, y: 3.4, width: 5 },
  { x: BOSS_ARENA_CENTER + 5, y: 3.4, width: 5 },
];

export type SpawnKind =
  | 'bug'
  | 'bot'
  | 'fly'
  | 'turret'
  | 'junior'
  | 'pickup'
  | 'boss';

export interface SpawnEntry {
  /** Fires once the camera's right edge reaches this world x. */
  trigger: number;
  kind: SpawnKind;
  count?: number;
  /** World x for fixed things (turret, junior, pickup, boss). */
  x?: number;
  /** World y (surface height) for fixed things. */
  y?: number;
  reward?: 'heavy' | 'claude' | 'grenade' | 'coffee' | 'points';
  /** Optional banner text shown when this entry fires. */
  banner?: string;
}

const fixed = (
  kind: SpawnKind,
  x: number,
  y: number,
  extra: Partial<SpawnEntry> = {},
): SpawnEntry => ({ trigger: x - 3, kind, x, y, ...extra });

const wave = (
  trigger: number,
  kind: SpawnKind,
  count: number,
  extra: Partial<SpawnEntry> = {},
): SpawnEntry => ({ trigger, kind, count, ...extra });

export const spawnScript: SpawnEntry[] = [
  // Zone 1: Legacy Codebase ------------------------------------------------------
  wave(0, 'bug', 0, { banner: 'ZONE 1: LEGACY CODEBASE  -  INC-4021: PROD IS DOWN' }),
  wave(16, 'bug', 2),
  wave(27, 'bug', 3),
  fixed('pickup', 33, 0, { reward: 'heavy' }),
  fixed('junior', 46.5, 3, { reward: 'heavy' }),
  wave(40, 'bot', 1),
  wave(52, 'fly', 2),
  wave(58, 'bot', 2),
  fixed('turret', 76, 2.4),
  fixed('junior', 63, 3.3, { reward: 'claude' }),
  wave(76, 'bug', 3),
  wave(80, 'fly', 2),
  wave(88, 'bot', 2),
  // Zone 2: Merge Conflict Canyon -------------------------------------------------
  wave(92, 'bug', 0, { banner: 'ZONE 2: MERGE CONFLICT CANYON  -  RESOLVE EVERYTHING' }),
  fixed('turret', 102, 3),
  wave(108, 'bot', 2),
  wave(110, 'fly', 2),
  fixed('turret', 122, 0),
  fixed('junior', 130, 3, { reward: 'grenade' }),
  wave(124, 'bug', 4),
  wave(134, 'bot', 3),
  fixed('turret', 143, 4.6),
  fixed('turret', 160, 3),
  wave(150, 'fly', 4),
  fixed('junior', 164, 3, { reward: 'heavy' }),
  wave(162, 'bot', 2),
  fixed('turret', 178, 0),
  wave(170, 'bug', 3),
  fixed('pickup', 183, 0, { reward: 'coffee' }),
  wave(182, 'fly', 3),
  wave(186, 'bot', 2),
  // Zone 3: Production ---------------------------------------------------------------
  wave(196, 'bug', 0, { banner: 'ZONE 3: PRODUCTION  -  ALMOST THERE' }),
  wave(205, 'bot', 3),
  wave(208, 'fly', 3),
  fixed('turret', 217, 3.4),
  fixed('pickup', 222, 0, { reward: 'claude' }),
  fixed('junior', 226, 0, { reward: 'coffee' }),
  wave(228, 'bug', 4),
  // Boss: spawns when the camera reaches the arena
  { trigger: BOSS_ARENA_CENTER + 13, kind: 'boss', x: BOSS_ARENA_CENTER + 8, y: 0 },
];

export const juniorsInLevel = spawnScript.filter((e) => e.kind === 'junior').length;
