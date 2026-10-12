/** Defines the types of axis measurements available for input axes. */
export declare const axisMeasurements: {
    /** The axis value is an absolute measurement. */
    readonly absolute: "absolute";
    /** The axis value is a delta measurement (change since last measurement). */
    readonly delta: "delta";
};
/** The type of axis measurement. */
export type AxisMeasurement = (typeof axisMeasurements)[keyof typeof axisMeasurements];
