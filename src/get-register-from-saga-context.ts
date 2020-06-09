// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { getContext, GetContextEffect } from 'redux-saga/effects';
import { ReduxRegister } from '.';

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
export function* getRegisterFromSagaContext(): Generator<GetContextEffect, ReduxRegister, ReduxRegister> {
  return yield getContext('register');
}
