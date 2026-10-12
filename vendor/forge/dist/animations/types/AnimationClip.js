import { ForgeEvent, ParameterizedForgeEvent } from '../../events/index.js';
/**
 * A sequence of sprite sheet frames that a sprite animation plays in order,
 * looping back to the first frame after the last.
 */
export class AnimationClip {
    /**
     * The frames of the animation.
     */
    frames;
    /**
     * The total number of frames in the animation.
     */
    frameCount;
    /**
     * Event that is raised when the animation starts.
     */
    onAnimationStartEvent;
    /**
     * Event that is raised when the animation ends.
     */
    onAnimationEndEvent;
    /**
     * Event that is raised every frame change. This includes the first and last frame change of an animation
     */
    onAnimationFrameChangeEvent;
    /**
     * Creates an instance of Animation.
     * @param frames - The frames of the animation.
     * @throws An error if `frames` is empty.
     */
    constructor(frames) {
        if (frames.length === 0) {
            throw new Error('Animation must contain at least one frame.');
        }
        this.frames = frames;
        this.frameCount = frames.length;
        this.onAnimationStartEvent = new ForgeEvent('AnimationStartEvent');
        this.onAnimationEndEvent = new ForgeEvent('AnimationEndEvent');
        this.onAnimationFrameChangeEvent =
            new ParameterizedForgeEvent('AnimationFrameChangeEvent');
    }
    /**
     * Gets a specific frame of the animation.
     * @param index - The index of the frame to retrieve.
     * @returns The requested AnimationFrame.
     * @throws An error if `index` is less than `0` or not less than `frameCount`.
     */
    getFrame(index) {
        if (index < 0 || index >= this.frames.length) {
            throw new Error('Frame index is out of bounds.');
        }
        return this.frames[index];
    }
}
