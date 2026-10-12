import { inputsId, } from '../components/inputs-component.js';
/**
 * Creates an ECS system to handle updating inputs.
 */
export const createUpdateInputEcsSystem = (time) => ({
    query: [inputsId],
    update: (_world, { components: [inputsComponents] }) => {
        for (const inputsComponent of inputsComponents) {
            inputsComponent.inputManager.update(time.deltaTimeInMilliseconds);
        }
    },
});
