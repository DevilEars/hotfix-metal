/**
 * The result of {@link withDefaults}: every field of `TDefaults` and
 * `TOptions`. A defaulted field takes the option's type, without
 * `undefined`, or the default's.
 */
export type WithDefaults<TDefaults, TOptions> = Omit<TOptions, keyof TDefaults> & {
    [K in keyof TDefaults]: K extends keyof TOptions ? Exclude<TOptions[K], undefined> | TDefaults[K] : TDefaults[K];
};
/**
 * Applies an options object over its defaults. An option that's
 * `undefined` takes its default, the same as one that's left out, the way
 * a default parameter does in JavaScript, so a caller can forward an
 * optional value without checking it first.
 * @param defaults - The default value of every defaulted option.
 * @param options - The options given, any of which may be left out or
 * `undefined`. `undefined` itself gives every default.
 * @returns A new object with every default, then every option that isn't
 * `undefined`.
 */
export declare function withDefaults<TDefaults extends object, TOptions extends object>(defaults: TDefaults, options: TOptions | undefined): WithDefaults<TDefaults, TOptions>;
