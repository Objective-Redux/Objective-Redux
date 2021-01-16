// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

/**
 * Checks if two values are deeply equal to each other.
 *
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns True if the objects match.
 *
 * @internal
 */
export function deepEquals(a: any, b: any): boolean {
  if (
    (typeof a !== 'object' || a == null)
    || (typeof b !== 'object' || b == null)
  ) {
    return a === b;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in a) {
    if (!(key in b) || !deepEquals(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
