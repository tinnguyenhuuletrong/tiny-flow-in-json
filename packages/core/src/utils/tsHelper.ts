/**
 * @file A TypeScript utility to assert that an array contains all and only the keys of an object type, and that they are unique.
 * author: Gemini-Pro 🪄
 */

// --- Internal Type Helpers ---
// These types perform the compile-time validation.

/** A robust type to check for equality between two types, A and B. */
type _IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false;

/** Checks if an element E exists in a readonly tuple T. */
type _IsInTuple<E, T extends readonly unknown[]> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? _IsEqual<E, Head> extends true
    ? true
    : _IsInTuple<E, Tail>
  : false;

/** Recursively checks a readonly tuple T for any duplicate elements. */
type _HasDuplicates<T extends readonly unknown[]> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? _IsInTuple<Head, Tail> extends true
    ? true
    : _HasDuplicates<Tail>
  : false;

/** Checks if a readonly tuple K contains exactly all keys of T. */
type _HasAllKeys<T extends object, K extends readonly (keyof T)[]> = _IsEqual<
  keyof T,
  K[number]
>;

/**
 * A type utility that returns a function to validate **at compile time** that an array contains **all and only**
 * the keys of a given object type `T`, and that all keys are unique.
 *
 * **IMPORTANT**: You must use `as const` on the array passed to the returned function for the compile-time check to work.
 *
 * @template T - The object type from which the keys are derived. Must be a subtype of `object`.
 * @returns A new function that takes a `readonly` tuple of keys and validates them.
 * @throws A TypeScript compiler error if the array has duplicates, is missing keys, or has extra keys.
 *
 * @example
 * // Define an interface
 * interface UserProfile { id: number; name: string; email: string; }
 *
 * // This will compile:
 * const valid = asAllUniqueKeys<UserProfile>()(['id', 'name', 'email'] as const);
 *
 * // This will cause a compile-time error (missing 'email'):
 * // const missing = asAllUniqueKeys<UserProfile>()(['id', 'name'] as const);
 *
 * // This will cause a compile-time error (duplicate 'id'):
 * // const duplicate = asAllUniqueKeys<UserProfile>()(['id', 'name', 'id'] as const);
 */
export function asAllUniqueKeys<T extends object>() {
  return <const K extends readonly (keyof T)[]>(
    keys: K &
      (_HasDuplicates<K> extends true ? never : K) &
      (_HasAllKeys<T, K> extends false ? never : K)
  ): K => {
    // The implementation is trivial. The magic happens in the type signature,
    // which validates the `keys` parameter at compile time.
    return keys;
  };
}
