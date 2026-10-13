import { addPositionComponent } from '@forge-game-engine/forge/common';
import { addSpriteComponent, Color, createImageSprite, SpriteEcsComponent } from '@forge-game-engine/forge/rendering';
import { addTextComponent } from '@forge-game-engine/forge/text';
import { TextureName } from './assets';
import { followCameraId, parallaxId } from './components';
import { BOSS_ARENA_CENTER, Layer, PIXELS_PER_UNIT, RenderCat, VIEW_HEIGHT } from './constants';
import { Ctx } from './ctx';
import { platforms } from './level';
import { BRAND } from './brand';

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

interface Board {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  titleColor: Color;
  subtitleColor: Color;
}

const hex = (value: string, boost = 1): Color => {
  const n = parseInt(value.slice(1), 16);

  return new Color(((n >> 16) & 255) / 255 * boost, ((n >> 8) & 255) / 255 * boost, (n & 255) / 255 * boost, 1);
};

function buildBillboards(ctx: Ctx): void {
  const { world } = ctx;
  const entelectBlue = hex(BRAND.entelect.blue, 1.15);
  const lime = hex(BRAND.entelect.lime);
  const claude = hex(BRAND.claude.orange);
  const light = new Color(0.85, 0.9, 1, 1);

  const boards: Board[] = [
    { x: 15.5, y: 8.4, title: 'ENTELECT', subtitle: BRAND.entelect.tagline, titleColor: entelectBlue, subtitleColor: lime },
    { x: 53, y: 8.6, title: 'git blame', subtitle: 'was not me', titleColor: light, subtitleColor: lime },
    { x: 97, y: 8.8, title: 'Claude', subtitle: 'Preferred Partner', titleColor: claude, subtitleColor: light },
    { x: 136, y: 9.2, title: 'NOT A BUG', subtitle: "it's a feature", titleColor: light, subtitleColor: lime },
    { x: 188, y: 8.6, title: 'ENTELECT', subtitle: BRAND.entelect.tagline, titleColor: entelectBlue, subtitleColor: lime },
    { x: 211, y: 9, title: 'LGTM', subtitle: 'ship it', titleColor: light, subtitleColor: claude },
    { x: BOSS_ARENA_CENTER, y: 10.2, title: 'PRODUCTION', subtitle: 'no deploys on Fridays', titleColor: new Color(1, 0.4, 0.4, 1), subtitleColor: light },
  ];

  for (const board of boards) {
    const frame = world.createEntity();
    addPositionComponent(world, frame, { local: { x: board.x, y: board.y }, isStatic: true });
    addSpriteComponent(world, frame, {
      ...tile(ctx, 'billboard', Layer.billboard),
      pivot: { x: 0.5, y: 0.5 },
    });

    const title = world.createEntity();
    addPositionComponent(world, title, { local: { x: board.x - 4.6, y: board.y + 0.2 }, isStatic: true });
    addTextComponent(world, title, {
      text: board.title,
      fontAtlas: ctx.assets.font,
      size: 1.15,
      color: board.titleColor,
      category: RenderCat.world,
      layer: Layer.billboard + 1,
      verticalAlign: 'baseline',
      horizontalAlign: 'center',
      maxWidth: 9.2,
      letterSpacing: 0.06,
    });

    const subtitle = world.createEntity();
    addPositionComponent(world, subtitle, { local: { x: board.x - 4.6, y: board.y - 0.55 }, isStatic: true });
    addTextComponent(world, subtitle, {
      text: board.subtitle,
      fontAtlas: ctx.assets.font,
      size: 0.6,
      color: board.subtitleColor,
      category: RenderCat.world,
      layer: Layer.billboard + 1,
      verticalAlign: 'baseline',
      horizontalAlign: 'center',
      maxWidth: 9.2,
    });
  }
}

export function buildWorld(ctx: Ctx): void {
  buildBackdrop(ctx);
  buildGround(ctx);
  buildProps(ctx);
  buildBillboards(ctx);
}
