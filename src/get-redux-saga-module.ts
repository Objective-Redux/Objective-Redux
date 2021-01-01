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
 * Gets Redux-Saga module, if it is installed.
 *
 * @internal
 * @returns An instance of Redux-Saga.
 */
export function getReduxSagaModule(): any {
  try {
    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    return require('redux-saga');
  } catch (e) {
    /* istanbul ignore next */
    return null;
  }
}

/**
 * Gets Redux-Saga effects, if Redux-Saga is installed.
 *
 * @internal
 * @returns An instance of Redux-Saga effects.
 */
export function getReduxSagaEffects(): any {
  // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
  return require('redux-saga/effects');
}
