import { createComponentId } from '../../ecs/ecs-component.js';
import { TONE_MAPPING_OPERATOR, } from '../enums/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
export const toneMappingId = createComponentId('toneMapping');
const defaultToneMappingOptions = {
    exposure: 1,
    operator: TONE_MAPPING_OPERATOR.aces,
};
/**
 * Attaches a {@link ToneMappingEcsComponent} to a camera entity, so
 * `createToneMapEcsSystem` compresses that camera's HDR render target back
 * into displayable `[0, 1]` range. Has no effect if the entity's camera
 * doesn't have a `renderTarget`.
 * @param world - The ECS world `entity` belongs to.
 * @param entity - The camera entity to attach tone mapping to.
 * @param options - Options for configuring the tone mapping.
 * @returns The attached component, for further tuning or runtime changes.
 */
export function addToneMappingComponent(world, entity, options = {}) {
    const component = withDefaults(defaultToneMappingOptions, options);
    return world.addComponent(entity, toneMappingId, component);
}
