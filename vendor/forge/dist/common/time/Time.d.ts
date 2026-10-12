/**
 * Class to manage and track time-related information.
 */
export declare class Time {
    private _frames;
    private _rawTimeInMilliseconds;
    private _rawDeltaTimeInMilliseconds;
    private _deltaTimeInMilliseconds;
    private _timeInMilliseconds;
    private _previousTimeInMilliseconds;
    private _rawTimeInSeconds;
    private _rawDeltaTimeInSeconds;
    private _deltaTimeInSeconds;
    private _timeInSeconds;
    private _previousTimeInSeconds;
    private _timeScale;
    private readonly _times;
    private static readonly _maxDeltaTimeInMilliseconds;
    /**
     * Creates an instance of Time.
     */
    constructor();
    /**
     * Gets the number of frames: the number of times `update` has been called.
     * @returns The number of frames.
     */
    get frames(): number;
    /**
     * Gets the raw time in milliseconds: the timestamp passed to the latest
     * `update`, not affected by `timeScale`.
     * @returns The raw time in milliseconds.
     */
    get rawTimeInMilliseconds(): number;
    /**
     * Gets the raw delta time in milliseconds: the difference between the
     * latest two timestamps passed to `update`, not scaled or limited.
     * @returns The raw delta time in milliseconds.
     */
    get rawDeltaTimeInMilliseconds(): number;
    /**
     * Gets the delta time in milliseconds: the raw delta time multiplied by
     * `timeScale`, limited to the range `0` to `1000 / 15` (except on the first
     * `update`).
     * @returns The delta time in milliseconds.
     */
    get deltaTimeInMilliseconds(): number;
    /**
     * Gets the time in milliseconds: the sum of every frame's delta time, so it
     * follows `timeScale`.
     * @returns The time in milliseconds.
     */
    get timeInMilliseconds(): number;
    /**
     * Gets the previous time in milliseconds: the raw time of the previous
     * `update`.
     * @returns The previous time in milliseconds.
     */
    get previousTimeInMilliseconds(): number;
    /**
     * Gets the raw time in seconds: the timestamp passed to the latest
     * `update`, not affected by `timeScale`.
     * @returns The raw time in seconds.
     */
    get rawTimeInSeconds(): number;
    /**
     * Gets the raw delta time in seconds: the difference between the latest
     * two timestamps passed to `update`, not scaled or limited.
     * @returns The raw delta time in seconds.
     */
    get rawDeltaTimeInSeconds(): number;
    /**
     * Gets the delta time in seconds: the raw delta time multiplied by
     * `timeScale`, limited to the range `0` to `1 / 15` (except on the first
     * `update`).
     * @returns The delta time in seconds.
     */
    get deltaTimeInSeconds(): number;
    /**
     * Gets the time in seconds: the sum of every frame's delta time, so it
     * follows `timeScale`.
     * @returns The time in seconds.
     */
    get timeInSeconds(): number;
    /**
     * Gets the previous time in seconds: the raw time of the previous
     * `update`.
     * @returns The previous time in seconds.
     */
    get previousTimeInSeconds(): number;
    /**
     * Gets the time scale, the multiplier applied to the delta time. `1` is
     * normal speed and `0` pauses time. Defaults to `1`.
     * @returns The time scale.
     */
    get timeScale(): number;
    /**
     * Sets the time scale.
     * @param value - The new time scale.
     */
    set timeScale(value: number);
    /**
     * Gets the timestamps, in milliseconds, of the `update` calls within the
     * last second. `fps` is its length.
     * @returns The times array.
     */
    get times(): number[];
    /**
     * Updates the time-related information. `Game` calls it once per frame,
     * before updating its worlds.
     * @param time - The current time in milliseconds, such as
     * `performance.now()`.
     */
    update(time: number): void;
    /**
     * Gets the current frames per second (FPS): the number of `update` calls
     * within the last second.
     * @returns The current FPS.
     */
    get fps(): number;
}
