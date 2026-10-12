/**
 * Branding for the demo, kept in one place so it is easy to correct.
 *
 * The colours are approximations taken from the public websites; the logos
 * are NOT bundled. Drop the official artwork into `public/brand/` as
 * `entelect-logo.png` and `claude-logo.png` and the title screen picks them
 * up automatically (the text wordmarks below are only the fallback).
 */
export const BRAND = {
  entelect: {
    name: 'ENTELECT',
    tagline: 'Everything is possible',
    blue: '#1e6fe0',
    lime: '#a5c249',
    logo: 'brand/entelect-logo.png',
  },
  claude: {
    name: 'Claude',
    orange: '#d97757',
    logo: 'brand/claude-logo.png',
    partnerLine: 'Claude Partner Network - Preferred Partner',
  },
  game: {
    title: 'HOTFIX METAL',
    subtitle: 'A production-incident run-and-gun',
  },
} as const;
