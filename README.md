# HOTFIX METAL — an Entelect × Claude run-and-gun demo

A Metal-Slug-style side-scrolling shooter built on the [Forge game engine](https://forge-game-engine.github.io/Forge/) (v0.26.1, TypeScript, ECS, WebGL2).
You are a senior engineer shipping a hotfix through production: shoot bugs, bots and flaky builds, rescue junior devs, and take down the boss. All art, audio and names are original.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve dist/
npm run typecheck
```

`npm run assets` regenerates pixel art (needs Python + Pillow) and audio (needs Python + numpy). Generated files are already committed in `public/`.

## Controls

| Action | Keys |
|---|---|
| Move | A / D or ← / → |
| Jump | W / ↑ / Space |
| Crouch | S / ↓ |
| Shoot | J / Z / Left mouse |
| Grenade | K / X |
| Start / restart | Enter |
| Mute | M |

Debug: append `?start=<x>` (e.g. `?start=240` for the boss arena) to start further into the level.

## Forge dependency

Forge is published on GitHub Packages, which needs a personal access token. To keep this project installable offline, a built copy lives in `vendor/forge` and `package.json` points to it (`file:vendor/forge`).
To use the registry version instead, add an `.npmrc` with the `@forge-game-engine` scope and your PAT, then change the dependency to the published version.

## Branding

Brand config lives in `src/brand.ts` (colours, tagline, names). Official logos are **not** bundled: drop `entelect-logo.png` and `claude-logo.png` into `public/brand/` and they replace the text wordmarks automatically.
Colours are approximations (Entelect blue `#1e6fe0`, lime `#a5c249`; Claude coral `#d97757`). Confirm Entelect brand approval and Claude Partner Network co-marketing guidelines before any external use.

## Layout

- `src/game.ts` — world, cameras, input, system registration order
- `src/level.ts` — platforms and the spawn script
- `src/systems/` — player, enemies/boss, projectiles/pickups, collisions, combat, camera, flow
- `src/spawn.ts` — entity factories; `src/hud.ts` — HUD; `src/world.ts` — backdrop and billboards

## Feasibility notes

Forge is a good fit for a 2D run-and-gun: ECS, sprite animation, sensor colliders, particles, bloom, audio and MSDF text are all there. Gaps: no built-in platformer physics (the demo uses a custom kinematic controller), no tilemap/level editor, and the engine is pre-1.0 so APIs may change.
Alternatives: Phaser 3 (largest ecosystem, built-in Arcade physics), Excalibur.js (TypeScript, platformer-friendly), Godot 4 with web export (editor, tilemaps, animation tooling).

## Hosting on GitHub Pages

The build is fully static (`base: './'`), so it works from a project subpath.
1. Create a GitHub repo and push this folder (including `vendor/forge`, which must be committed; `.gitignore` only excludes `/dist` and `node_modules`).
2. Repo Settings > Pages > Source: **GitHub Actions**.
3. Push to `main`; `.github/workflows/pages.yml` builds and deploys. Site: `https://<user>.github.io/<repo>/`.
