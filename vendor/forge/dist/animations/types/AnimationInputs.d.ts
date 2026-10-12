import { Updatable } from '../../common/index.js';
/**
 * Interface representing a single animation input
 */
export interface AnimationInput<T> {
    /**
     * The name of the input.
     */
    name: string;
    /**
     * The current value of the input.
     */
    value: T;
}
/**
 * Class to store and manage all animation inputs used in the animation controller
 */
export declare class AnimationInputs implements Updatable {
    /**
     * A map of text inputs (string) used in the animation controller
     */
    textInputs: Map<string, AnimationInput<string>>;
    /**
     * A map of number inputs (number) used in the animation controller
     */
    numberInputs: Map<string, AnimationInput<number>>;
    /**
     * A map of toggle inputs (boolean) used in the animation controller
     */
    toggleInputs: Map<string, AnimationInput<boolean>>;
    /**
     * A map of trigger inputs (boolean) used in the animation controller
     */
    triggerInputs: Map<string, AnimationInput<boolean>>;
    /**
     * The current playback percentage of the animation clip (0 to 1)
     */
    animationClipPlaybackPercentage: number;
    /**
     * Creates a new instance of AnimationInputs.
     * Initializes empty maps for text, number, toggle, and trigger inputs.
     */
    constructor();
    update(): void;
    /**
     * Registers a new toggle input.
     * @param name - the name of the input
     * @param startingValue - the starting value for the input. Default is false.
     */
    registerToggle(name: string, startingValue?: boolean): void;
    /**
     * Sets the value of a toggle input.
     * @param name - the name of the input
     * @param value - the new value for the input
     */
    setToggle(name: string, value: boolean): void;
    /**
     * Gets the value of a toggle input.
     * @param name - the name of the input
     * @returns The current value of the input
     */
    getToggle(name: string): AnimationInput<boolean> | null;
    /**
     * Registers a new trigger input.
     * @param name - the name of the input
     */
    registerTrigger(name: string): void;
    /**
     * Sets the value of a trigger input to true.
     * @param name - the name of the input
     */
    setTrigger(name: string): void;
    /**
     * Gets the value of a trigger input.
     * @param name - the name of the input
     * @returns The current value of the input
     */
    getTrigger(name: string): AnimationInput<boolean> | null;
    /**
     * Registers a new number input.
     * @param name - the name of the input
     * @param startingValue - the starting value for the input. Default is 0.
     */
    registerNumber(name: string, startingValue?: number): void;
    /**
     * Sets the value of a number input.
     * @param name - the name of the input
     * @param value - the new value for the input
     */
    setNumber(name: string, value: number): void;
    /**
     * Gets the value of a number input.
     * @param name - the name of the input
     * @returns The current value of the input
     */
    getNumber(name: string): AnimationInput<number> | null;
    /**
     * Registers a new text input.
     * @param name - the name of the input
     * @param startingValue - the starting value for the input. Default is an empty string.
     */
    registerText(name: string, startingValue?: string): void;
    /**
     * Sets the value of a text input.
     * @param name - the name of the input
     * @param value - the new value for the input
     */
    setText(name: string, value: string): void;
    /**
     * Gets the value of a text input.
     * @param name - the name of the input
     * @returns The current value of the input
     */
    getText(name: string): AnimationInput<string> | null;
    /**
     * A generic method to register a new input of any type.
     * @param name - the name of the input
     * @param animationInputMap - the map to register the input in
     * @param startingValue - the starting value for the input.
     */
    private _registerInput;
    /**
     * A generic method to get an input of any type by name.
     * @param name - the name of the input
     * @param animationInputMap - the map to search for the input in
     * @returns The input with the specified name
     */
    private _getInput;
}
