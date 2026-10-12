import { inputsId, } from '../components/inputs-component.js';
/**
 * Creates an ECS system to handle resetting inputs.
 */
export const createResetInputsEcsSystem = () => ({
    query: [inputsId],
    update: (_world, { components: [inputsComponents] }) => {
        for (const inputsComponent of inputsComponents) {
            inputsComponent.inputManager.reset();
        }
    },
});
