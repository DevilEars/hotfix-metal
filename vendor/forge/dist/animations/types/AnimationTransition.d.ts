import { Transition } from '../../finite-state-machine/index.js';
import { Predicate } from '../../utilities/index.js';
import { AnimationInputs } from './AnimationInputs.js';
export type AnimationExitType = 'immediate' | 'atEndOfAnimation';
export type AnimationTransitionOptions = {
    exitType?: AnimationExitType;
};
export declare class AnimationTransition extends Transition<AnimationInputs> {
    readonly exitType: AnimationExitType;
    constructor(predicates: Predicate<AnimationInputs>[], options?: AnimationTransitionOptions);
    satisfies(input: AnimationInputs): boolean;
}
