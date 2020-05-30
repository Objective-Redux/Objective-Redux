// ================================================================================================
//                                          Objective Redux
//                 (c) Copyright 2020 by Jason Mace (jmace01). All rights reserved.
//
// This code is provided under the terms of the [object Object] license. See the LICENSE file for
// terms.
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
export function* getRegisterFromContext(): Generator<GetContextEffect, ReduxRegister, ReduxRegister> {
  return yield getContext('register');
}
