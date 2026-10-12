import { Transition } from '../../finite-state-machine/index.js';
import { withDefaults } from '../../utilities/with-defaults.js';
const defaultAnimationTransitionOptions = {
    exitType: 'immediate',
};
export class AnimationTransition extends Transition {
    exitType;
    constructor(predicates, options = {}) {
        super(...predicates);
        const { exitType } = withDefaults(defaultAnimationTransitionOptions, options);
        this.exitType = exitType;
    }
    satisfies(input) {
        return super.satisfies(input);
    }
}
