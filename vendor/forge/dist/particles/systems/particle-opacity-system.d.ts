import { EcsSystem } from '../../ecs/ecs-system.js';
import { LifetimeEcsComponent } from '../../lifecycle/components/lifetime-component.js';
import { SpriteEcsComponent } from '../../rendering/components/sprite-component.js';
import { ParticleEcsComponent } from '../components/particle-component.js';
/**
 * Creates an ECS system that fades every particle's sprite from its
 * `startOpacity` to its `endOpacity` over its lifetime, by setting
 * `SpriteEcsComponent.opacityMultiplier`.
 * @returns The particle opacity ECS system.
 */
export declare const createParticleOpacityEcsSystem: () => EcsSystem<[LifetimeEcsComponent, SpriteEcsComponent, ParticleEcsComponent]>;
