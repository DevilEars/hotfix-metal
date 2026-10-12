import { createComponentId } from '../../../ecs/ecs-component.js';
import { withDefaults } from '../../../utilities/with-defaults.js';
export const terrainMeshId = createComponentId('terrainMesh');
const defaultTerrainMeshOptions = {
    category: 0xffffffff,
};
/**
 * Attaches a {@link TerrainMeshEcsComponent} to `entity`, so
 * `createTerrainRenderEcsSystem` draws its `mesh` every frame. A world can
 * have any number of entities with this component - each terrain mesh is
 * drawn independently, so multiple `TerrainCollider`s can each have their
 * own visualized mesh.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The entity to attach the component to.
 * @param options - Options for configuring the terrain mesh. `mesh` has no
 * sensible default and must always be provided.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addTerrainMeshComponent(world, entity, options) {
    const component = withDefaults(defaultTerrainMeshOptions, options);
    return world.addComponent(entity, terrainMeshId, component);
}
