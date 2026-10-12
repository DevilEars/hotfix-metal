import { Predicate } from '../utilities/index.js';
export declare class Transition<TInput> {
    readonly predicates: Predicate<TInput>[];
    constructor(...predicates: Predicate<TInput>[]);
    satisfies(input: TInput): boolean;
}
