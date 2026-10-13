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
  'rack_l',
  'rack_r',
  'sign_screen',
  'sign_pole',
  'sign_neon_cyan',
  'sign_neon_pink',
  'sign_hanging',
  'sign_cable',
  'sign_hazard',
  'hud_banner',
  'hud_banner_warn',
  'hud_bossbar',
  'sky',
  'stars',
  'skyline_far',
  'skyline_near',
  'prop_antenna',
  'prop_box',
  'prop_box_wide',
  'prop_hotel',
  'prop_monitor',
  'prop_banner_big',
  'prop_banner_side',
] as const;
export type TextureName = (typeof textureNames)[number];

export type ClipName =
  | 'player_idle'
  | 'player_run'
  | 'player_jump'
  | 'player_crouch'
  | 'player_hurt'
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
  /** Kenney Pixel Square: titles, billboards, the HUD banner. */
  fontDisplay: FontAtlas;
  /** Kenney Mini Square: HUD rows, subtitles, popups. */
  fontBody: FontAtlas;
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

  const fontCache = new FontAtlasCache(renderContext);
  const loadFont = (name: string): Promise<FontAtlas> =>
    fontCache.getOrLoad({ metricsUrl: `fonts/${name}.json`, imageUrl: `fonts/${name}.png` });
  const [fontDisplay, fontBody] = await Promise.all([loadFont('pixel-display'), loadFont('pixel-body')]);

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

  // Strip layouts match scripts/make_art.py.
  add('player_idle', tex.player, 17, 4, 0);
  add('player_run', tex.player, 17, 8, 4);
  add('player_jump', tex.player, 17, 2, 12);
  add('player_crouch', tex.player, 17, 1, 14);
  add('player_hurt', tex.player, 17, 1, 15);
  add('player_dead', tex.player, 17, 1, 16);
  add('bug_walk', tex.bug, 6, 6);
  add('bot_idle', tex.bot, 7, 1, 0);
  add('bot_walk', tex.bot, 7, 4, 1);
  add('bot_shoot', tex.bot, 7, 2, 5);
  add('fly_flap', tex.fly, 4, 4);
  add('turret_idle', tex.turret, 3, 1, 0);
  add('turret_fire', tex.turret, 3, 2, 1);
  add('junior_tied', tex.junior, 8, 4, 0);
  add('junior_free', tex.junior, 8, 4, 4);
  add('explosion', tex.explosion, 6, 6);
  add('boss_idle', tex.boss, 6, 2, 0);
  add('boss_open', tex.boss, 6, 2, 2);
  add('boss_rage', tex.boss, 6, 2, 4);

  return {
    tex,
    clips,
    clip,
    fontDisplay,
    fontBody,
    sounds,
    music,
    mixer,
    sfxBus,
    musicBus,
  };
}
