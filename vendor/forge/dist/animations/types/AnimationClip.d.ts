import { ForgeEvent, ParameterizedForgeEvent } from '../../events/index.js';
import { AnimationFrame } from './AnimationFrame.js';
/**
 * Event type that is raised when the animation frame changes.
 */
export type OnAnimationFrameChangeEvent = ParameterizedForgeEvent<AnimationFrame>;
/**
 * A sequence of sprite sheet frames that a sprite animation plays in order,
 * looping back to the first frame after the last.
 */
export declare class AnimationClip {
    /**
     * The frames of the animation.
     */
    readonly frames: AnimationFrame[];
    /**
     * The total number of frames in the animation.
     */
    readonly frameCount: number;
    /**
     * Event that is raised when the animation starts.
     */
    readonly onAnimationStartEvent: ForgeEvent;
    /**
     * Event that is raised when the animation ends.
     */
    readonly onAnimationEndEvent: ForgeEvent;
    /**
     * Event that is raised every frame change. This includes the first and last frame change of an animation
     */
    readonly onAnimationFrameChangeEvent: OnAnimationFrameChangeEvent;
    /**
     * Creates an instance of Animation.
     * @param frames - The frames of the animation.
     * @throws An error if `frames` is empty.
     */
    constructor(frames: AnimationFrame[]);
    /**
     * Gets a specific frame of the animation.
     * @param index - The index of the frame to retrieve.
     * @returns The requested AnimationFrame.
     * @throws An error if `index` is less than `0` or not less than `frameCount`.
     */
    getFrame(index: number): AnimationFrame;
}
