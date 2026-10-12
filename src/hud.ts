import { addPositionComponent, positionId, PositionEcsComponent } from '@forge-game-engine/forge/common';
import { EcsSystem } from '@forge-game-engine/forge/ecs';
import { addSpriteComponent, Color, getCameraView, spriteId } from '@forge-game-engine/forge/rendering';
import { addTextComponent, textId } from '@forge-game-engine/forge/text';
import { BRAND } from './brand';
import { HudComponent, hudId } from './components';
import { RenderCat } from './constants';
import { Ctx } from './ctx';
import { solidSprite } from './spawn';

const entelectBlue = BRAND.entelect.blue;
const claudeOrange = BRAND.claude.orange;
const UI_LAYER = 10;

type Slot = HudComponent['slot'];

function addHudText(
  ctx: Ctx,
  slot: Slot,
  anchor: HudComponent['anchor'],
  size: number,
  text: string,
  options: { color?: Color; maxWidth?: number; align?: 'left' | 'center' | 'right'; vAlign?: 'top' | 'bottom' | 'middle'; offsetX?: number; offsetY?: number } = {},
): void {
  const { world } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x: 0, y: 0 } });
  addTextComponent(world, entity, {
    text,
    fontAtlas: ctx.assets.font,
    size,
    color: options.color ?? Color.white,
    category: RenderCat.ui,
    layer: UI_LAYER,
    outlineColor: new Color(0.03, 0.04, 0.12, 1),
    outlineWidth: 2,
    horizontalAlign: options.align ?? 'left',
    verticalAlign: options.vAlign ?? 'top',
    maxWidth: options.maxWidth,
  });
  world.addComponent(entity, hudId, {
    slot,
    anchor,
    offsetX: options.offsetX ?? 0,
    offsetY: options.offsetY ?? 0,
  });
}

function addHudBar(ctx: Ctx, slot: Slot, tint: Color, width: number, height: number, layer: number): void {
  const { world } = ctx;
  const entity = world.createEntity();

  addPositionComponent(world, entity, { local: { x: 0, y: 0 } });
  addSpriteComponent(world, entity, {
    ...solidSprite(ctx, width, height, tint, layer, RenderCat.ui),
    pivot: { x: 0, y: 0.5 },
  });
  world.addComponent(entity, hudId, { slot, anchor: 'center', offsetX: 0, offsetY: 0 });
}

export function createHud(ctx: Ctx): void {
  addHudText(ctx, 'score', 'topLeft', 0.55, 'STORY POINTS 0000000');
  addHudText(ctx, 'lives', 'topLeft', 0.55, 'COFFEE x3', { offsetY: -0.7 });
  addHudText(ctx, 'juniors', 'topLeft', 0.55, 'JUNIORS 0/0', { offsetY: -1.4 });
  addHudText(ctx, 'weapon', 'topRight', 0.55, 'COMMIT INF', { maxWidth: 9, align: 'right' });
  addHudText(ctx, 'grenades', 'topRight', 0.55, 'GIT REVERT x5', { maxWidth: 9, align: 'right', offsetY: -0.7 });
  addHudText(ctx, 'banner', 'topCenter', 0.52, '', { maxWidth: 24, align: 'center', offsetY: -0.95, color: new Color(1, 0.92, 0.55, 1) });
  addHudText(ctx, 'bossName', 'topCenter', 0.5, 'THE LEGACY MONOLITH', { maxWidth: 14, align: 'center', offsetY: -1.85, color: new Color(1, 0.5, 0.5, 1) });
  addHudBar(ctx, 'bossBarBack', new Color(0.08, 0.1, 0.2, 1), 12.4, 0.6, UI_LAYER - 2);
  addHudBar(ctx, 'bossBarFill', new Color(0.95, 0.3, 0.35, 1), 12, 0.36, UI_LAYER - 1);
  addHudText(
    ctx,
    'brand',
    'bottomLeft',
    0.4,
    `<color=${entelectBlue}>ENTELECT</color> x <color=${claudeOrange}>Claude</color>`,
    { vAlign: 'bottom', offsetX: 0, offsetY: 0.2 },
  );
  addHudText(
    ctx,
    'controls',
    'bottomRight',
    0.34,
    'MOVE a/d | JUMP k | SHOOT j | REVERT l | AIM w | CROUCH s',
    { maxWidth: 20, align: 'right', vAlign: 'bottom', offsetY: 0.2, color: new Color(0.7, 0.78, 0.95, 1) },
  );
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

      for (let i = 0; i < entities.length; i++) {
        const hud = huds[i];
        const position = positions[i].local;
        const text = world.getComponent(entities[i], textId);
        const sprite = world.getComponent(entities[i], spriteId);
        const margin = 0.7;

        switch (hud.anchor) {
          case 'topLeft':
            position.x = -halfW + margin + hud.offsetX;
            position.y = halfH - 0.5 + hud.offsetY;
            break;
          case 'topRight':
            position.x = halfW - margin - (text?.maxWidth ?? 0) + hud.offsetX;
            position.y = halfH - 0.5 + hud.offsetY;
            break;
          case 'topCenter':
            position.x = -(text?.maxWidth ?? 0) / 2 + hud.offsetX;
            position.y = halfH - 0.5 + hud.offsetY;
            break;
          case 'bottomLeft':
            position.x = -halfW + margin + hud.offsetX;
            position.y = -halfH + hud.offsetY;
            break;
          case 'bottomRight':
            position.x = halfW - margin - (text?.maxWidth ?? 0) + hud.offsetX;
            position.y = -halfH + hud.offsetY;
            break;
          case 'center':
            position.x = -6.2;
            position.y = halfH - 3.15;
            break;
        }

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
          case 'banner':
            if (text) text.text = state.banner;
            opacity = visible ? Math.min(1, state.bannerSeconds * 1.5) : 0;
            break;
          case 'bossName':
            opacity = visible && state.bossActive ? 1 : 0;
            break;
          case 'bossBarBack':
            opacity = visible && state.bossActive ? 1 : 0;
            position.x -= 0.2;
            break;
          case 'bossBarFill':
            opacity = visible && state.bossActive ? 1 : 0;
            if (sprite) sprite.width = Math.max(0.001, 12 * (state.bossHp / state.bossMaxHp));
            break;
          case 'controls':
            opacity = visible && state.runSeconds < 14 ? 1 : 0;
            break;
          default:
            break;
        }

        if (text) {
          text.opacityMultiplier = opacity;
          // Outlines ignore opacity, so switch them off with the text.
          text.outlineWidth = opacity > 0.02 ? 2 : 0;
        }
        if (sprite) sprite.opacityMultiplier = opacity;
      }
    },
  };
}
