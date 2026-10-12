import { Stoppable, Time } from '../common/index.js';
import { EcsWorld } from '../ecs/ecs-world.js';
/**
 * Runs the game loop: every `requestAnimationFrame` frame, it updates its
 * `Time` with `performance.now()` and calls `update()` on each of its
 * `EcsWorld`s, in array order. It doesn't render or resize anything.
 */
export declare class Game implements Stoppable {
    /**
     * The HTML element associated with the game (e.g. the one containing its
     * canvas), for consumers that need a DOM anchor (input sources, overlay
     * elements, etc.). `Game` itself does nothing with it.
     */
    readonly container: HTMLElement;
    private _isRunning;
    private _animationFrameId;
    private readonly _time;
    private readonly _worlds;
    /**
     * Creates a new Game instance.
     * @param time - The Time instance for managing time-related operations.
     * @param worlds - The ECS worlds to update once per frame and stop when the game stops. A game can drive more than one, e.g. a gameplay world alongside a separate UI overlay world.
     * @param container - The HTML element associated with the game.
     */
    constructor(time: Time, worlds: readonly EcsWorld[], container: HTMLElement);
    /**
     * Starts the game loop. The first frame's delta time is measured from
     * this call. Does nothing if the game is already running.
     */
    run(): void;
    /**
     * Stops the game loop: cancels the next frame and calls `stop()` on each
     * world, which runs every registered system's `cleanup`.
     */
    stop(): void;
    private readonly _gameLoop;
}
