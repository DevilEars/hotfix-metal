const textConditionComparator = {
    equals: (input, value) => input === value,
    contains: (input, value) => input.includes(value),
    isContainedIn: (input, value) => value.includes(input),
    startsWith: (input, value) => input.startsWith(value),
    endsWith: (input, value) => input.endsWith(value),
};
/**
 * Class for text-based animation conditions.
 */
export class AnimationTextCondition {
    name;
    text;
    _comparator;
    /**
     * Constructor for AnimationTextCondition.
     * @param name - The name of the condition.
     * @param text - The text value to compare against.
     * @param comparator - The comparator type to use for the condition.
     */
    constructor(name, text, comparator) {
        this.name = name;
        this.text = text;
        this._comparator = textConditionComparator[comparator];
    }
    /**
     * Method to check the condition based on the input value.
     * @param inputs - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs) {
        const animationInput = inputs.getText(this.name);
        if (!animationInput) {
            throw new Error(`Animation input with name "${this.name}" not found.`);
        }
        return this._comparator(animationInput.value, this.text);
    }
}
const numberConditionComparator = {
    equals: (input, value) => input === value,
    lessThan: (input, value) => input < value,
    lessThanOrEqual: (input, value) => input <= value,
    greaterThan: (input, value) => input > value,
    greaterThanOrEqual: (input, value) => input >= value,
};
/**
 * Class for number-based animation conditions.
 */
export class AnimationNumberCondition {
    name;
    number;
    _comparator;
    constructor(name, number, comparator) {
        this.name = name;
        this.number = number;
        this._comparator = numberConditionComparator[comparator];
    }
    /**
     * Method to check the condition based on the input value.
     * @param inputs - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs) {
        const input = inputs.getNumber(this.name);
        if (!input) {
            throw new Error(`Animation input with name "${this.name}" not found.`);
        }
        return this._comparator(input.value, this.number);
    }
}
/**
 * Class for toggle (boolean)-based animation conditions.
 */
export class AnimationToggleCondition {
    name;
    toggleValue;
    constructor(name, toggleValue = true) {
        this.name = name;
        this.toggleValue = toggleValue;
    }
    /**
     * Method to check the condition based on the input value.
     * @param inputValue - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs) {
        const input = inputs.getToggle(this.name);
        if (!input) {
            throw new Error(`Animation input with name "${this.name}" not found.`);
        }
        return input.value === this.toggleValue;
    }
}
/**
 * Class for trigger (boolean)-based animation conditions.
 */
export class AnimationTriggerCondition {
    name;
    constructor(name) {
        this.name = name;
    }
    /**
     * Method to check the condition based on the input value.
     * @param inputValue - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs) {
        const input = inputs.getTrigger(this.name);
        if (!input) {
            throw new Error(`Animation input with name "${this.name}" not found.`);
        }
        return input.value === true;
    }
}
export class AnimationExitTimeCondition {
    name;
    exitTime;
    constructor(name, exitTime = 1) {
        this.name = name;
        this.exitTime = exitTime;
    }
    /**
     * Method to check the condition based on the input value.
     * @param inputValue - the value of the input to validate the condition against
     * @returns Whether the condition is met based on the input value.
     */
    satisfies(inputs) {
        return inputs.animationClipPlaybackPercentage >= this.exitTime;
    }
}
