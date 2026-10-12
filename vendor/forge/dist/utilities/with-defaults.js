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
export function withDefaults(defaults, options) {
    const givenOptions = Object.fromEntries(Object.entries(options ?? {}).filter(([, value]) => value !== undefined));
    // `Object.fromEntries` loses the options' field types, which the
    // filter keeps: every field of `givenOptions` is a field of `options`.
    return { ...defaults, ...givenOptions };
}
