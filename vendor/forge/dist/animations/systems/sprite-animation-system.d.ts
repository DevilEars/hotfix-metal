import { Time } from '../../common/index.js';
import { type SpriteAnimationEcsComponent } from '../components/index.js';
import { EcsSystem } from '../../ecs/index.js';
import { AnimationClip } from '../index.js';
import { AssetRegistry } from '../../asset-loading/asset-registry.js';
import { SpriteEcsComponent } from '../../rendering/index.js';
/**
 * Creates a new ECS-style sprite animation system. For each entity with a
 * `SpriteAnimationEcsComponent` and a sprite, once
 * `frameDurationMilliseconds / playbackSpeed` has passed since the last frame
 * change (by `time.timeInSeconds`), it writes the offset of the frame at
 * `animationFrameIndex` to the sprite's `uvOffset` and moves
 * `animationFrameIndex` to the next frame, back to `0` after the clip's last
 * frame.
 * @param time - The Time instance.
 * @param animationRegistry - The registry containing animation clips.
 * @returns An ECS system that updates sprite animations.
 * @throws An error during an update if a component's scaled frame duration
 * isn't greater than `0`, or if its `animationFrameIndex` is out of bounds
 * for its clip.
 */
export declare const createSpriteAnimationEcsSystem: (time: Time, animationRegistry: AssetRegistry<AnimationClip>) => EcsSystem<[SpriteAnimationEcsComponent, SpriteEcsComponent]>;
