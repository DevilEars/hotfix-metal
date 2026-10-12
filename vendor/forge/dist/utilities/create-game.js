import { Time } from '../common/index.js';
import { EcsWorld } from '../ecs/ecs-world.js';
import { createCanvas, createRenderContext, } from '../rendering/index.js';
import { createContainerResizeSync, } from './create-container-resize-sync.js';
import { Game } from './game.js';
import { withDefaults } from './with-defaults.js';
const defaultCreateGameOptions = {
    renderContext: {},
};
/**
 * Creates a new game instance with the specified container ID.
 * @param containerId - The ID of the container element where the game will be rendered.
 * @param options - Options for the game, such as the `RenderContextOptions` to create its render context with.
 * @returns An object containing the game instance, ECS world, render context, time, and the resize sync keeping the render context's canvas sized to the container.
 * @throws An error if no DOM element with `containerId` exists.
 */
export function createGame(containerId, options = {}) {
    const { renderContext: renderContextOptions } = withDefaults(defaultCreateGameOptions, options);
    const time = new Time();
    const world = new EcsWorld();
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`No DOM element with ID "${containerId}" found.`);
    }
    const canvas = createCanvas(container);
    const renderContext = createRenderContext(canvas, renderContextOptions);
    const resizeSync = createContainerResizeSync(container, [renderContext]);
    const game = new Game(time, [world], container);
    return { game, world, time, renderContext, resizeSync };
}
