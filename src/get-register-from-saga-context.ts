// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { getReduxSagaEffects } from './get-redux-saga-module';
import { ReduxRegister } from './';

/**
 * Gets the register from the saga's context.
 *
 * @example
 * ```typescript
 * function* () {
 *   const register = yield getRegisterFromContext();
 * }
 * ```
 * @returns A generator that yields an instance of the ReduxRegister.
 */
export function* getRegisterFromSagaContext(): Generator<any, ReduxRegister, ReduxRegister> {
  const reguxSagaEffects = getReduxSagaEffects();
  return yield reguxSagaEffects.getContext('register');
}
