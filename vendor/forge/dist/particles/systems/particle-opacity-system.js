import { lifetimeId, } from '../../lifecycle/components/lifetime-component.js';
import { clamp } from '../../math/clamp.js';
import { lerp } from '../../math/lerp.js';
import { spriteId, } from '../../rendering/components/sprite-component.js';
import { ParticleId, } from '../components/particle-component.js';
/**
 * Creates an ECS system that fades every particle's sprite from its
 * `startOpacity` to its `endOpacity` over its lifetime, by setting
 * `SpriteEcsComponent.opacityMultiplier`.
 * @returns The particle opacity ECS system.
 */
export const createParticleOpacityEcsSystem = () => ({
    query: [lifetimeId, spriteId, ParticleId],
    update: (_world, { components: [lifetimes, sprites, particles] }) => {
        for (let i = 0; i < lifetimes.length; i++) {
            const { elapsedSeconds, durationSeconds } = lifetimes[i];
            const { startOpacity, endOpacity } = particles[i];
            const lifetimeRatio = durationSeconds > 0 ? clamp(elapsedSeconds / durationSeconds, 0, 1) : 1;
            sprites[i].opacityMultiplier = lerp(startOpacity, endOpacity, lifetimeRatio);
        }
    },
});
