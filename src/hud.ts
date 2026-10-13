import { addPositionComponent, positionId, PositionEcsComponent } from '@forge-game-engine/forge/common';
import { EcsSystem } from '@forge-game-engine/forge/ecs';
import { addSpriteComponent, Color, createImageSprite, getCameraView, spriteId } from '@forge-game-engine/forge/rendering';
import { addTextComponent, textId } from '@forge-game-engine/forge/text';
import { BRAND } from './brand';
import { HudComponent, hudId } from './components';
import { PIXELS_PER_UNIT, RenderCat } from './constants';
import { Ctx } from './ctx';
import { solidSprite } from './spawn';
import { hardShadow, TEXT_SHADOW, textSize } from './text';

const entelectBlue = BRAND.entelect.blue;
const claudeOrange = BRAND.claude.orange;
const UI_LAYER = 10;
const px = (value: number): number => value / PIXELS_PER_UNIT;

// Boss bar geometry, from the hud_bossbar texture (208x18 px, slot x 22..204).
const BOSS_FRAME_WIDTH = px(208);
const BOSS_SLOT_LEFT = px(22);
const BOSS_SLOT_WIDTH = px(183);

const bannerYellow = new Color(1, 0.9, 0.5, 1);
const bannerRed = new Color(1, 0.42, 0.42, 1);
const bannerSubColor = new Color(0.78, 0.86, 1, 1);
const noShadow = new Color(0, 0, 0, 0);

type Slot = HudComponent['slot'];

interface HudTextOptions {
  font?: 'display' | 'body';
  color?: Color;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'bottom' | 'middle';
  offsetX?: number;
  offsetY?: number;
}

function addHudText(ctx: Ctx, slot: Slot, anchor: HudComponent['anchor'], text: string, options: HudTextOptions = {}): void {
  const { world } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x: 0, y: 0 } });
  addTextComponent(world, entity, {
    text,
    fontAtlas: options.font === 'body' ? ctx.assets.fontBody : ctx.assets.fontDisplay,
    size: textSize(1),
    color: options.color ?? Color.white,
    category: RenderCat.ui,
    layer: UI_LAYER,
    horizontalAlign: options.align ?? 'left',
    verticalAlign: options.vAlign ?? 'top',
    maxWidth: options.maxWidth,
    letterSpacing: 0.125,
    ...hardShadow,
  });
  world.addComponent(entity, hudId, { slot, anchor, offsetX: options.offsetX ?? 0, offsetY: options.offsetY ?? 0 });
}

function addHudImage(ctx: Ctx, slot: Slot, anchor: HudComponent['anchor'], texture: 'hud_banner' | 'hud_bossbar', layer: number): void {
  const { world } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x: 0, y: 0 } });
  addSpriteComponent(world, entity, {
    ...createImageSprite(ctx.assets.tex[texture], { pixelsPerUnit: PIXELS_PER_UNIT }),
    pivot: { x: 0.5, y: 0.5 },
    category: RenderCat.ui,
    layer,
  });
  world.addComponent(entity, hudId, { slot, anchor, offsetX: 0, offsetY: 0 });
}

function addHudBar(ctx: Ctx, slot: Slot, tint: Color, height: number, layer: number, offsetY = 0): void {
  const { world } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x: 0, y: 0 } });
  addSpriteComponent(world, entity, {
    ...solidSprite(ctx, BOSS_SLOT_WIDTH, height, tint, layer, RenderCat.ui),
    pivot: { x: 0, y: 0.5 },
  });
  world.addComponent(entity, hudId, { slot, anchor: 'boss', offsetX: BOSS_SLOT_LEFT - BOSS_FRAME_WIDTH / 2, offsetY });
}

/** Splits "TITLE - subtitle" banners into a headline and a smaller second line. */
function splitBanner(banner: string): [string, string] {
  const at = banner.indexOf(' - ');

  return at < 0 ? [banner.trim(), ''] : [banner.slice(0, at).trim(), banner.slice(at + 3).trim()];
}

const isWarning = (title: string): boolean => /^(WARNING|PHASE)/.test(title);

export function createHud(ctx: Ctx): void {
  addHudText(ctx, 'score', 'topLeft', 'STORY POINTS 0000000');
  addHudText(ctx, 'lives', 'topLeft', 'COFFEE x3', { offsetY: -0.7 });
  addHudText(ctx, 'juniors', 'topLeft', 'JUNIORS 0/0', { offsetY: -1.4 });
  addHudText(ctx, 'weapon', 'topRight', 'COMMIT INF', { maxWidth: 10, align: 'right' });
  addHudText(ctx, 'grenades', 'topRight', 'GIT REVERT x5', { maxWidth: 10, align: 'right', offsetY: -0.7 });

  // Announcement banner: panel, headline, second line.
  addHudImage(ctx, 'bannerPanel', 'banner', 'hud_banner', UI_LAYER - 1);
  addHudText(ctx, 'banner', 'banner', '', { maxWidth: 19, align: 'center', vAlign: 'middle', offsetY: 0.3, color: bannerYellow });
  addHudText(ctx, 'bannerSub', 'banner', '', { font: 'body', maxWidth: 19, align: 'center', vAlign: 'middle', offsetY: -0.38, color: bannerSubColor });

  // Boss health: framed bar under the banner, the name printed on the bar.
  addHudImage(ctx, 'bossFrame', 'boss', 'hud_bossbar', UI_LAYER - 2);
  addHudBar(ctx, 'bossBarFill', new Color(0.95, 0.28, 0.34, 1), px(8), UI_LAYER - 1);
  addHudBar(ctx, 'bossBarShine', new Color(1, 0.62, 0.62, 1), px(1), UI_LAYER, px(3));
  addHudText(ctx, 'bossName', 'boss', 'THE LEGACY MONOLITH', { maxWidth: BOSS_SLOT_WIDTH, align: 'center', vAlign: 'middle', offsetX: px(11), offsetY: px(0.5) });

  addHudText(ctx, 'brand', 'bottomLeft', `<color=${entelectBlue}>ENTELECT</color> x <color=${claudeOrange}>CLAUDE</color>`, {
    font: 'body',
    vAlign: 'bottom',
    offsetY: 0.3,
  });
  addHudText(ctx, 'controls', 'bottomRight', 'MOVE A/D   JUMP K   SHOOT J   REVERT L   AIM W   CROUCH S', {
    font: 'body',
    maxWidth: 20,
    align: 'right',
    vAlign: 'bottom',
    offsetY: 0.3,
    color: new Color(0.7, 0.78, 0.95, 1),
  });
}

const pad = (value: number, width: number): string => String(Math.max(0, Math.floor(value))).padStart(width, '0');

export function createHudSystem(ctx: Ctx): EcsSystem<[HudComponent, PositionEcsComponent]> {
  return {
    name: 'hotfix-hud',
    query: [hudId, positionId],
    update: (world, { entities, components: [huds, positions] }) => {
      const view = getCameraView(world, ctx.cam.ui, ctx.renderContext).size;
      const halfW = view.x / 2;
      const halfH = view.y / 2;
      const { state } = ctx;
      const visible = state.phase !== 'title';
      const [bannerTitle, bannerSub] = splitBanner(state.banner);
      const warning = isWarning(bannerTitle);
      const bannerOpacity = visible && state.banner ? Math.min(1, state.bannerSeconds * 1.5) : 0;
      const bossOpacity = visible && state.bossActive ? 1 : 0;

      for (let i = 0; i < entities.length; i++) {
        const hud = huds[i];
        const position = positions[i].local;
        const text = world.getComponent(entities[i], textId);
        const sprite = world.getComponent(entities[i], spriteId);
        const margin = 0.7;
        const boxWidth = text?.maxWidth ?? 0;

        switch (hud.anchor) {
          case 'topLeft':
            position.x = -halfW + margin;
            position.y = halfH - 0.5;
            break;
          case 'topRight':
            position.x = halfW - margin - boxWidth;
            position.y = halfH - 0.5;
            break;
          case 'bottomLeft':
            position.x = -halfW + margin;
            position.y = -halfH;
            break;
          case 'bottomRight':
            position.x = halfW - margin - boxWidth;
            position.y = -halfH;
            break;
          case 'banner':
            // Below the three HUD rows, centred.
            position.x = -boxWidth / 2;
            position.y = halfH - 3.6;
            break;
          case 'boss':
            position.x = -boxWidth / 2;
            position.y = halfH - 6.1;
            break;
        }
        position.x += hud.offsetX;
        position.y += hud.offsetY;

        let opacity = visible ? 1 : 0;

        switch (hud.slot) {
          case 'score':
            if (text) text.text = `STORY POINTS ${pad(state.score, 7)}`;
            break;
          case 'lives':
            if (text) text.text = `COFFEE x${Math.max(0, state.lives)}`;
            break;
          case 'juniors':
            if (text) text.text = `JUNIORS ${state.rescued}/${state.juniorsTotal}`;
            break;
          case 'weapon':
            if (text) {
              text.text =
                state.weapon === 'commit'
                  ? 'COMMIT  INF'
                  : `${state.weapon === 'heavy' ? 'HEAVY COMMIT' : 'CLAUDE ASSIST'}  ${pad(state.ammo, 3)}`;
              text.color = state.weapon === 'claude' ? new Color(0.95, 0.5, 0.35, 1) : state.weapon === 'heavy' ? new Color(1, 0.85, 0.35, 1) : Color.white;
            }
            break;
          case 'grenades':
            if (text) text.text = `GIT REVERT x${state.grenades}`;
            break;
          case 'bannerPanel':
            opacity = bannerOpacity;
            if (sprite) sprite.texture = ctx.assets.tex[warning ? 'hud_banner_warn' : 'hud_banner'];
            break;
          case 'banner':
            opacity = bannerOpacity;
            if (text) {
              text.text = bannerTitle;
              text.color = warning ? bannerRed : bannerYellow;
            }
            break;
          case 'bannerSub':
            opacity = bannerOpacity;
            if (text) text.text = bannerSub;
            break;
          case 'bossName':
          case 'bossFrame':
            opacity = bossOpacity;
            break;
          case 'bossBarFill':
          case 'bossBarShine':
            opacity = bossOpacity;
            if (sprite) sprite.width = Math.max(0.001, BOSS_SLOT_WIDTH * (state.bossHp / state.bossMaxHp));
            break;
          case 'controls':
            opacity = visible && state.runSeconds < 14 ? 1 : 0;
            break;
          default:
            break;
        }

        if (text) {
          text.opacityMultiplier = opacity;
          // Shadows ignore opacity, so switch them off with the text.
          text.shadowColor = opacity > 0.02 ? TEXT_SHADOW : noShadow;
        }
        if (sprite) sprite.opacityMultiplier = opacity;
      }
    },
  };
}
