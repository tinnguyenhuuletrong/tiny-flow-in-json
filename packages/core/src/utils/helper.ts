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

  // remaining
  for (const key of allKeys) {
    sortedObj[key] = obj[key];
  }

  return JSON.stringify(sortedObj, null, space);
}
