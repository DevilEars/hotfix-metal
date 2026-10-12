import { ScaleEcsComponent } from '../../common/index.js';
import { LifetimeEcsComponent } from '../../lifecycle/components/lifetime-component.js';
import { AgeScaleEcsComponent } from '../components/age-scale-component.js';
import { EcsSystem } from '../../ecs/ecs-system.js';
/**
 * Creates an ECS system to handle age-based scaling of entities.
 *
 * It writes the local scale; `createTransformEcsSystem` turns that into the
 * world scale.
 * @returns An ECS system that updates the scale of entities based on their lifetime.
 */
export declare const createAgeScaleEcsSystem: () => EcsSystem<[LifetimeEcsComponent, ScaleEcsComponent, AgeScaleEcsComponent]>;
