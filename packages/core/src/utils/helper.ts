/**
 * Stringifies a JSON object with keys ordered according to a specified array.
 *
 * This function creates a new object with properties ordered as in `keyOrder`,
 * followed by any remaining keys in their original order. The result is then
 * stringified using `JSON.stringify` with the given indentation.
 *
 * @param obj - The object to stringify.
 * @param keyOrder - An array specifying the order of keys to appear first in the output.
 * @param space - Number of spaces for indentation (default: 2).
 * @returns The JSON string with ordered keys.
 */
export function orderedJsonStringify(
  obj: Record<string, any>,
  keyOrder: readonly string[],
  space: number = 2
): string {
  const sortedObj: any = {};
  const allKeys = new Set(Object.keys(obj));
  for (const key of keyOrder) {
    sortedObj[key] = obj[key];
    allKeys.delete(key);
  }

  for (const key of allKeys) {
    sortedObj[key] = obj[key];
  }

  return JSON.stringify(sortedObj, null, space);
}
