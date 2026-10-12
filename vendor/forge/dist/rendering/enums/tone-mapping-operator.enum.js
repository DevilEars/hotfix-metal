/**
 * The `TONE_MAPPING_OPERATOR` lookup defines the curve `createToneMapEcsSystem`
 * uses to compress HDR color into displayable `[0, 1]` range.
 */
export const TONE_MAPPING_OPERATOR = {
    /** A simple `color / (color + 1)` curve: cheap, but desaturates highlights. */
    reinhard: 'reinhard',
    /** The Narkowicz ACES filmic fit: a cinematic highlight rolloff. */
    aces: 'aces',
};
