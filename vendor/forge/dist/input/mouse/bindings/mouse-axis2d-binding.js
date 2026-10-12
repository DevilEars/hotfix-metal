import { cursorValueTypes } from '../../constants/index.js';
import { withDefaults } from '../../../utilities/with-defaults.js';
const defaultMouseAxis2dBindingOptions = {
    cursorValueType: cursorValueTypes.ratio,
    cursorOrigin: { x: 0.5, y: 0.5 },
};
/**
 * Mouse axis 2D input binding. Sets its action to the cursor's position on
 * every `mousemove`, measured from `cursorOrigin` with `y` increasing
 * downward.
 */
export class MouseAxis2dBinding {
    /** The action associated with this binding. */
    action;
    /** A human-readable description of this binding. */
    displayText;
    /** How the cursor's position is measured. Defaults to `cursorValueTypes.ratio`. */
    cursorValueType;
    /**
     * The point the cursor's position is measured from, as a fraction of the
     * container's width and height from its top-left corner. Defaults to
     * `(0.5, 0.5)`, the center.
     */
    cursorOrigin;
    /** Constructs a new MouseAxis2dBinding.
     * @param action - The action associated with this binding.
     * @param options - How the cursor's position is measured.
     * @param options.cursorValueType - Ratio of the container's size (the default) or CSS pixels.
     * @param options.cursorOrigin - The point positions are measured from, as a fraction of the container's size. Defaults to the center.
     */
    constructor(action, options) {
        this.action = action;
        this.displayText = 'mouse position';
        const { cursorValueType, cursorOrigin } = withDefaults(defaultMouseAxis2dBindingOptions, options);
        this.cursorValueType = cursorValueType;
        this.cursorOrigin = cursorOrigin;
    }
}
