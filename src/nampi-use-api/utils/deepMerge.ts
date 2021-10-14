const isObject = (item: unknown): item is Record<string, unknown> =>
  item !== undefined && typeof item === "object" && !Array.isArray(item);

/** Merges two objects, code based on https://stackoverflow.com/a/37164538 */
export const deepMerge = <
  T extends Record<string, unknown>,
  S extends Record<string, unknown>
>(
  target: T,
  source: S
): T & S => {
  const output = Object.assign({}, target) as T & S;
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else
          (output as Record<string, unknown>)[key] = deepMerge(
            target[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>
          );
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};
