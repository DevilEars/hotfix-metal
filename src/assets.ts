import {
  AnimationClip,
  createSpriteSheet,
  selectAnimationFrames,
} from '@forge-game-engine/forge/animations';
import { AssetRegistry } from '@forge-game-engine/forge/asset-loading';
import {
  createSoundMixer,
  MixerBus,
  SoundAsset,
  SoundAssetCache,
  SoundMixer,
} from '@forge-game-engine/forge/audio';
import { RenderContext, Texture } from '@forge-game-engine/forge/rendering';
import { FontAtlas, FontAtlasCache } from '@forge-game-engine/forge/text';

const art = (name: string): string => `art/${name}.png`;

export const sfxNames = [
  'shoot',
  'shoot_heavy',
  'claude',
  'jump',
  'hurt',
  'explode',
  'hit',
  'grenade',
  'pickup',
  'rescue',
  'victory',
  'gameover',
  'boss',
] as const;
export type SfxName = (typeof sfxNames)[number];

export const textureNames = [
  'player',
  'bug',
  'bot',
  'fly',
  'turret',
  'junior',
  'pickups',
  'explosion',
  'boss',
  'ground_top',
  'ground_fill',
  'rack',
  'billboard',
  'sky',
  'stars',
  'skyline_far',
  'skyline_near',
] as const;
export type TextureName = (typeof textureNames)[number];

export type ClipName =
  | 'player_idle'
  | 'player_run'
  | 'player_jump'
  | 'player_dead'
  | 'bug_walk'
  | 'bot_idle'
  | 'bot_walk'
  | 'bot_shoot'
  | 'fly_flap'
  | 'turret_idle'
  | 'turret_fire'
  | 'junior_tied'
  | 'junior_free'
  | 'explosion'
  | 'boss_idle'
  | 'boss_open'
  | 'boss_rage';

export interface Assets {
  tex: Record<TextureName, Texture>;
  clips: AssetRegistry<AnimationClip>;
  clip: Record<ClipName, number>;
  font: FontAtlas;
  sounds: Record<SfxName, SoundAsset>;
  music: SoundAsset;
  mixer: SoundMixer;
  sfxBus: MixerBus;
  musicBus: MixerBus;
}

export async function loadAssets(renderContext: RenderContext): Promise<Assets> {
  // Pixel art: nearest filtering keeps the edges crisp at any zoom.
  const entries = await Promise.all(
    textureNames.map(
      async (name) =>
        [
          name,
          await renderContext.textureCache.getOrLoad(art(name), {
            filter: 'nearest',
          }),
        ] as const,
    ),
  );
  const tex = Object.fromEntries(entries) as Record<TextureName, Texture>;

  const mixer = createSoundMixer();
  const sfxBus = mixer.createBus('sfx');
  const musicBus = mixer.createBus('music');
  const soundCache = new SoundAssetCache(mixer);
  const soundEntries = await Promise.all(
    sfxNames.map(
      async (name) =>
        [name, await soundCache.getOrLoad(`audio/${name}.wav`)] as const,
    ),
  );
  const sounds = Object.fromEntries(soundEntries) as Record<SfxName, SoundAsset>;
  const music = await soundCache.getOrLoad('audio/music.wav');

  const fontAtlas = await new FontAtlasCache(renderContext).getOrLoad({
    metricsUrl: 'fonts/default.json',
    imageUrl: 'fonts/default.png',
  });

  // Animation clips -----------------------------------------------------------
  const clips = new AssetRegistry<AnimationClip>();
  const clip = {} as Record<ClipName, number>;
  const add = (
    name: ClipName,
    texture: Texture,
    columns: number,
    count: number,
    start = 0,
    rows = 1,
  ): void => {
    const sheetFrames = createSpriteSheet(texture, rows, columns);
    clip[name] = clips.register(
      name,
      new AnimationClip(selectAnimationFrames(sheetFrames, count, start)),
    );
  };

  add('player_idle', tex.player, 8, 2, 0);
  add('player_run', tex.player, 8, 4, 2);
  add('player_jump', tex.player, 8, 1, 6);
  add('player_dead', tex.player, 8, 1, 7);
  add('bug_walk', tex.bug, 4, 4);
  add('bot_idle', tex.bot, 4, 1, 0);
  add('bot_walk', tex.bot, 4, 2, 1);
  add('bot_shoot', tex.bot, 4, 1, 3);
  add('fly_flap', tex.fly, 2, 2);
  add('turret_idle', tex.turret, 2, 1, 0);
  add('turret_fire', tex.turret, 2, 1, 1);
  add('junior_tied', tex.junior, 4, 2, 0);
  add('junior_free', tex.junior, 4, 2, 2);
  add('explosion', tex.explosion, 6, 6);
  add('boss_idle', tex.boss, 3, 1, 0);
  add('boss_open', tex.boss, 3, 1, 1);
  add('boss_rage', tex.boss, 3, 1, 2);

  return {
    tex,
    clips,
    clip,
    font: fontAtlas,
    sounds,
    music,
    mixer,
    sfxBus,
    musicBus,
  };
}
