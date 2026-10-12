/**
 * Class to store and manage all animation inputs used in the animation controller
 */
export class AnimationInputs {
    /**
     * A map of text inputs (string) used in the animation controller
     */
    textInputs;
    /**
     * A map of number inputs (number) used in the animation controller
     */
    numberInputs;
    /**
     * A map of toggle inputs (boolean) used in the animation controller
     */
    toggleInputs;
    /**
     * A map of trigger inputs (boolean) used in the animation controller
     */
    triggerInputs;
    /**
     * The current playback percentage of the animation clip (0 to 1)
     */
    animationClipPlaybackPercentage = 0;
    /**
     * Creates a new instance of AnimationInputs.
     * Initializes empty maps for text, number, toggle, and trigger inputs.
     */
    constructor() {
        this.textInputs = new Map();
        this.numberInputs = new Map();
        this.toggleInputs = new Map();
        this.triggerInputs = new Map();
    }
    update() {
        for (const triggerInput of this.triggerInputs.values()) {
            triggerInput.value = false;
        }
    }
    /**
     * Registers a new toggle input.
     * @param name - the name of the input
     * @param startingValue - the starting value for the input. Default is false.
     */
    registerToggle(name, startingValue = false) {
        this._registerInput(name, this.toggleInputs, startingValue);
    }
    /**
     * Sets the value of a toggle input.
     * @param name - the name of the input
     * @param value - the new value for the input
     */
    setToggle(name, value) {
        const toggle = this.getToggle(name);
        if (!toggle) {
            throw new Error(`Input with name ${name} does not exist.`);
        }
        toggle.value = value;
    }
    /**
     * Gets the value of a toggle input.
     * @param name - the name of the input
     * @returns The current value of the input
     */
    getToggle(name) {
        return this._getInput(name, this.toggleInputs);
    }
    /**
     * Registers a new trigger input.
     * @param name - the name of the input
     */
    registerTrigger(name) {
        this._registerInput(name, this.triggerInputs, false);
    }
    /**
     * Sets the value of a trigger input to true.
     * @param name - the name of the input
     */
    setTrigger(name) {
        const trigger = this.getTrigger(name);
        if (!trigger) {
            throw new Error(`Input with name ${name} does not exist.`);
        }
        trigger.value = true;
    }
    /**
     * Gets the value of a trigger input.
     * @param name - the name of the input
     * @returns The current value of the input
     */
    getTrigger(name) {
        return this._getInput(name, this.triggerInputs);
    }
    /**
     * Registers a new number input.
     * @param name - the name of the input
     * @param startingValue - the starting value for the input. Default is 0.
     */
    registerNumber(name, startingValue = 0) {
        this._registerInput(name, this.numberInputs, startingValue);
    }
    /**
     * Sets the value of a number input.
     * @param name - the name of the input
     * @param value - the new value for the input
     */
    setNumber(name, value) {
        const number = this.getNumber(name);
        if (!number) {
            throw new Error(`Input with name ${name} does not exist.`);
        }
        number.value = value;
    }
    /**
     * Gets the value of a number input.
     * @param name - the name of the input
     * @returns The current value of the input
     */
    getNumber(name) {
        return this._getInput(name, this.numberInputs);
    }
    /**
     * Registers a new text input.
     * @param name - the name of the input
     * @param startingValue - the starting value for the input. Default is an empty string.
     */
    registerText(name, startingValue = '') {
        this._registerInput(name, this.textInputs, startingValue);
    }
    /**
     * Sets the value of a text input.
     * @param name - the name of the input
     * @param value - the new value for the input
     */
    setText(name, value) {
        const text = this.getText(name);
        if (!text) {
            throw new Error(`Input with name ${name} does not exist.`);
        }
        text.value = value;
    }
    /**
     * Gets the value of a text input.
     * @param name - the name of the input
     * @returns The current value of the input
     */
    getText(name) {
        return this._getInput(name, this.textInputs);
    }
    /**
     * A generic method to register a new input of any type.
     * @param name - the name of the input
     * @param animationInputMap - the map to register the input in
     * @param startingValue - the starting value for the input.
     */
    _registerInput(name, animationInputMap, startingValue) {
        if (animationInputMap.has(name)) {
            throw new Error(`Input with name ${name} already exists.`);
        }
        animationInputMap.set(name, { name, value: startingValue });
    }
    /**
     * A generic method to get an input of any type by name.
     * @param name - the name of the input
     * @param animationInputMap - the map to search for the input in
     * @returns The input with the specified name
     */
    _getInput(name, animationInputMap) {
        const input = animationInputMap.get(name);
        if (!input) {
            return null;
        }
        return input;
    }
}
