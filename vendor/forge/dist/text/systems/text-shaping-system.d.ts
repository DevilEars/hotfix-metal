import { EcsSystem } from '../../ecs/ecs-system.js';
import { TextEcsComponent } from '../components/text-component.js';
/**
 * Creates a text shaping ECS system: turns dirty `TextEcsComponent`s into
 * `TextMeshEcsComponent`s (glyph quads + bounds), only re-shaping an
 * entity's text when a shape-relevant field has actually changed since the
 * last tick this system ran against it.
 * @returns The ECS system.
 */
export declare const createTextShapingEcsSystem: () => EcsSystem<[TextEcsComponent]>;
