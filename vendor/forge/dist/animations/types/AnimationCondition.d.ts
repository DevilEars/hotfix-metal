import { AnimationInputs } from './AnimationInputs.js';
/**
 * Comparator types for number animation conditions.
 */
type AnimationConditionNumberComparator = 'equals' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual';
/**
 * Comparator types for text animation conditions.
 */
type AnimationConditionTextComparator = 'equals' | 'contains' | 'isContainedIn' | 'startsWith' | 'endsWith';
/**
 * Union type representing all possible animation conditions.
 */
export interface AnimationCondition {
    name: string;
    satisfies(input: AnimationInputs): boolean;
}
/**
 * Class for text-based animation conditions.
 */
export declare class AnimationTextCondition implements AnimationCondition {
    name: string;
    text: string;
    private readonly _comparator;
    /**
     * Constructor for AnimationTextCondition.
     * @param name - The name of the condition.
     * @param text - The text value to compare against.
     * @param comparator - The comparator type to use for the condition.
     */
    constructor(name: string, text: string, comparator: AnimationConditionTextComparator);
    /**
     * Method to check the condition based on the input value.
     * @param inputs - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs: AnimationInputs): boolean;
}
/**
 * Class for number-based animation conditions.
 */
export declare class AnimationNumberCondition implements AnimationCondition {
    name: string;
    number: number;
    private readonly _comparator;
    constructor(name: string, number: number, comparator: AnimationConditionNumberComparator);
    /**
     * Method to check the condition based on the input value.
     * @param inputs - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs: AnimationInputs): boolean;
}
/**
 * Class for toggle (boolean)-based animation conditions.
 */
export declare class AnimationToggleCondition implements AnimationCondition {
    name: string;
    toggleValue: boolean;
    constructor(name: string, toggleValue?: boolean);
    /**
     * Method to check the condition based on the input value.
     * @param inputValue - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs: AnimationInputs): boolean;
}
/**
 * Class for trigger (boolean)-based animation conditions.
 */
export declare class AnimationTriggerCondition implements AnimationCondition {
    name: string;
    constructor(name: string);
    /**
     * Method to check the condition based on the input value.
     * @param inputValue - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs: AnimationInputs): boolean;
}
export declare class AnimationExitTimeCondition implements AnimationCondition {
    name: string;
    readonly exitTime: number;
    constructor(name: string, exitTime?: number);
    /**
     * Method to check the condition based on the input value.
     * @param inputValue - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs: AnimationInputs): boolean;
}
export {};
