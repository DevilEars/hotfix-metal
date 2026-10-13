import { addPositionComponent } from '@forge-game-engine/forge/common';
import { addSpriteComponent, Color, createImageSprite, SpriteEcsComponent } from '@forge-game-engine/forge/rendering';
import { addTextComponent } from '@forge-game-engine/forge/text';
import { TextureName } from './assets';
import { followCameraId, parallaxId, SignFlickerComponent, signFlickerId } from './components';
import { BOSS_ARENA_CENTER, Layer, PIXELS_PER_UNIT, RenderCat, VIEW_HEIGHT } from './constants';
import { Ctx } from './ctx';
import { platforms } from './level';
import { BRAND } from './brand';
import { hardShadow, textSize } from './text';

const tile = (ctx: Ctx, texture: TextureName, layer: number, category: number = RenderCat.world): SpriteEcsComponent => ({
  ...createImageSprite(ctx.assets.tex[texture], { pixelsPerUnit: PIXELS_PER_UNIT }),
  pivot: { x: 0.5, y: 0 },
  category,
  layer,
});

function buildBackdrop(ctx: Ctx): void {
  const { world } = ctx;

  // Sky: stretched gradient pinned to the camera.
  const sky = world.createEntity();
  addPositionComponent(world, sky, { local: { x: 0, y: 0 } });
  addSpriteComponent(world, sky, {
    ...tile(ctx, 'sky', Layer.sky, RenderCat.background),
    width: 60,
    height: VIEW_HEIGHT,
  });
  world.addComponent(sky, followCameraId, { offsetX: 0 });

  const layers: Array<[TextureName, number, number]> = [
    ['stars', 0.04, Layer.stars],
    ['skyline_far', 0.22, Layer.skylineFar],
    ['skyline_near', 0.5, Layer.skylineNear],
  ];

  for (const [texture, factor, layer] of layers) {
    for (let index = 0; index < 3; index++) {
      const entity = world.createEntity();
      const sprite = tile(ctx, texture, layer, RenderCat.background);

      addPositionComponent(world, entity, { local: { x: 0, y: 0 } });
      addSpriteComponent(world, entity, sprite);
      world.addComponent(entity, parallaxId, { factor, tileWidth: sprite.width, index });
    }
  }
}

function buildGround(ctx: Ctx): void {
  const { world } = ctx;
  const end = Math.ceil(BOSS_ARENA_CENTER + 22);

  for (let x = -6; x <= end; x++) {
    const top = world.createEntity();
    addPositionComponent(world, top, { local: { x: x + 0.5, y: -1 }, isStatic: true });
    addSpriteComponent(world, top, tile(ctx, 'ground_top', Layer.ground));

    const fill = world.createEntity();
    addPositionComponent(world, fill, { local: { x: x + 0.5, y: -4 }, isStatic: true });
    addSpriteComponent(world, fill, tile(ctx, 'ground_fill', Layer.ground));
  }

  for (const platform of platforms) {
    for (let k = 0; k < platform.width; k++) {
      const rack = world.createEntity();
      addPositionComponent(world, rack, {
        local: { x: platform.x + k + 0.5, y: platform.y - 1 },
        isStatic: true,
      });
      const texture = k === 0 ? 'rack_l' : k === platform.width - 1 ? 'rack_r' : 'rack';
      addSpriteComponent(world, rack, tile(ctx, texture, Layer.platform));
    }
  }
}

/** Street scenery from the Warped City pack; purely decorative, no colliders. */
const props: Array<[TextureName, number]> = [
  ['prop_box_wide', 6],
  ['prop_banner_big', 31],
  ['prop_monitor', 38],
  ['prop_antenna', 57],
  ['prop_box', 66],
  ['prop_banner_side', 88],
  ['prop_hotel', 117],
  ['prop_box_wide', 147],
  ['prop_banner_big', 162],
  ['prop_antenna', 181],
  ['prop_monitor', 196],
  ['prop_banner_side', 224],
  ['prop_box', 232],
];

function buildProps(ctx: Ctx): void {
  const { world } = ctx;

  for (const [texture, x] of props) {
    const prop = world.createEntity();
    addPositionComponent(world, prop, { local: { x, y: 0 }, isStatic: true });
    addSpriteComponent(world, prop, tile(ctx, texture, Layer.billboard));
  }
}

type SignStyle = 'screen' | 'neonCyan' | 'neonPink' | 'hanging' | 'hazard';

interface SignSpec {
  texture: TextureName;
  /** Frame size in world units. */
  width: number;
  height: number;
  /** Centre of the text area relative to the frame centre, and its width. */
  textY: number;
  textWidth: number;
  supports: 'poles' | 'cables' | 'none';
  flicker?: SignFlickerComponent['mode'];
}

const px = (value: number): number => value / PIXELS_PER_UNIT;

const signSpecs: Record<SignStyle, SignSpec> = {
  screen: { texture: 'sign_screen', width: px(160), height: px(64), textY: -px(2), textWidth: px(146), supports: 'poles' },
  neonCyan: { texture: 'sign_neon_cyan', width: px(160), height: px(56), textY: 0, textWidth: px(144), supports: 'none', flicker: 'flicker' },
  neonPink: { texture: 'sign_neon_pink', width: px(160), height: px(56), textY: 0, textWidth: px(144), supports: 'none', flicker: 'flicker' },
  hanging: { texture: 'sign_hanging', width: px(160), height: px(60), textY: -px(2), textWidth: px(146), supports: 'cables' },
  hazard: { texture: 'sign_hazard', width: px(192), height: px(72), textY: 0, textWidth: px(180), supports: 'poles', flicker: 'blink' },
};

interface Board {
  x: number;
  y: number;
  style: SignStyle;
  title: string;
  subtitle: string;
  titleColor: Color;
  subtitleColor: Color;
}

const hex = (value: string, boost = 1): Color => {
  const n = parseInt(value.slice(1), 16);

  return new Color(((n >> 16) & 255) / 255 * boost, ((n >> 8) & 255) / 255 * boost, (n & 255) / 255 * boost, 1);
};

/** Repeats a 1-unit-tall strip texture vertically between two heights. */
function strip(ctx: Ctx, texture: TextureName, x: number, from: number, to: number): void {
  for (let y = from; y < to; y++) {
    const entity = ctx.world.createEntity();
    addPositionComponent(ctx.world, entity, { local: { x, y }, isStatic: true });
    addSpriteComponent(ctx.world, entity, tile(ctx, texture, Layer.billboard));
  }
}

function addSignText(
  ctx: Ctx,
  x: number,
  y: number,
  options: { text: string; font: 'display' | 'body'; scale: number; color: Color; width: number; flicker?: SignFlickerComponent['mode'] },
): void {
  const { world } = ctx;
  const entity = world.createEntity();

  // Text boxes start at their left edge; centre the box on the sign.
  addPositionComponent(world, entity, { local: { x: x - options.width / 2, y }, isStatic: true });
  addTextComponent(world, entity, {
    text: options.text,
    fontAtlas: options.font === 'display' ? ctx.assets.fontDisplay : ctx.assets.fontBody,
    size: textSize(options.scale),
    color: options.color,
    category: RenderCat.world,
    layer: Layer.billboard + 1,
    verticalAlign: 'baseline',
    horizontalAlign: 'center',
    maxWidth: options.width,
    letterSpacing: 0.125,
    ...hardShadow,
  });

  if (options.flicker) {
    world.addComponent(entity, signFlickerId, { mode: options.flicker, base: options.color, dim: 0, phase: ctx.random.randomFloat(0, 3) });
  }
}

function buildBillboards(ctx: Ctx): void {
  const { world } = ctx;
  const light = new Color(0.85, 0.9, 1, 1);
  const lime = hex(BRAND.entelect.lime, 1.15);
  const ink = new Color(0.12, 0.08, 0.22, 1);

  // Titles above 1.0 bloom like neon; the lightbox uses dark ink instead.
  const boards: Board[] = [
    { x: 15.5, y: 8.4, style: 'screen', title: 'ENTELECT', subtitle: BRAND.entelect.tagline, titleColor: hex(BRAND.entelect.blue, 1.7), subtitleColor: lime },
    { x: 53, y: 8.6, style: 'neonCyan', title: 'git blame', subtitle: 'was not me', titleColor: new Color(0.7, 1.9, 2.3, 1), subtitleColor: lime },
    { x: 97, y: 8.8, style: 'screen', title: 'Claude', subtitle: 'Preferred Partner', titleColor: hex(BRAND.claude.orange, 1.25), subtitleColor: light },
    { x: 136, y: 9.2, style: 'hanging', title: 'NOT A BUG', subtitle: "it's a feature", titleColor: ink, subtitleColor: new Color(0.62, 0.26, 0.16, 1) },
    { x: 188, y: 8.6, style: 'screen', title: 'ENTELECT', subtitle: BRAND.entelect.tagline, titleColor: hex(BRAND.entelect.blue, 1.7), subtitleColor: lime },
    { x: 211, y: 9, style: 'neonPink', title: 'LGTM', subtitle: 'ship it', titleColor: new Color(2.3, 0.75, 2, 1), subtitleColor: light },
    { x: BOSS_ARENA_CENTER, y: 10.4, style: 'hazard', title: 'PRODUCTION', subtitle: 'no deploys on Fridays', titleColor: new Color(2.6, 0.55, 0.6, 1), subtitleColor: light },
  ];

  for (const board of boards) {
    const spec = signSpecs[board.style];
    const bottom = board.y - spec.height / 2;
    const top = board.y + spec.height / 2;

    if (spec.supports === 'poles') {
      for (const side of [-1, 1]) {
        strip(ctx, 'sign_pole', board.x + side * (spec.width / 2 - 1.5), 0, bottom);
      }
    } else if (spec.supports === 'cables') {
      strip(ctx, 'sign_cable', board.x - px(58), top - px(4), VIEW_HEIGHT + 2);
      strip(ctx, 'sign_cable', board.x + px(57), top - px(4), VIEW_HEIGHT + 2);
    }

    const frame = world.createEntity();
    addPositionComponent(world, frame, { local: { x: board.x, y: board.y }, isStatic: true });
    addSpriteComponent(world, frame, { ...tile(ctx, spec.texture, Layer.billboard), pivot: { x: 0.5, y: 0.5 } });

    const textY = board.y + spec.textY;
    addSignText(ctx, board.x, textY + 0.05, {
      text: board.title.toUpperCase(),
      font: 'display',
      scale: 2,
      color: board.titleColor,
      width: spec.textWidth,
      flicker: spec.flicker,
    });
    addSignText(ctx, board.x, textY - 0.8, {
      text: board.subtitle.toUpperCase(),
      font: 'body',
      scale: 1,
      color: board.subtitleColor,
      width: spec.textWidth,
    });
  }
}

export function buildWorld(ctx: Ctx): void {
  buildBackdrop(ctx);
  buildGround(ctx);
  buildProps(ctx);
  buildBillboards(ctx);
}
