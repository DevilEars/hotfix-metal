import { EcsSystem } from '../../ecs/ecs-system.js';
import { SoundEcsComponent } from '../components/index.js';
/**
 * Creates a system that plays each entity's {@link SoundEcsComponent}.
 *
 * Every update it starts sounds that haven't started, pauses and resumes
 * them as `paused` changes, applies changes to `volume`, `rate`, `loop`,
 * `bus` and `sound` to the playing sound, sets `hasFinished` once a
 * non-looping sound has played to its end, and stops the sound of any
 * component or entity removed since the last update. When the world stops,
 * every sound it started is stopped. Sound assets are left alone, so a new
 * world can play them again.
 * @returns The ECS system.
 */
export declare const createSoundEcsSystem: () => EcsSystem<[SoundEcsComponent]>;
