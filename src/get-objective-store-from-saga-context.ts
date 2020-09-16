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
import { ObjectiveStore } from '.';

/**
 * Gets the ObjectiveStore instance from the saga's context.
 *
 * @returns A generator that yields an instance of the ObjectiveStore.
 * @example
 * ```typescript
 * function* () {
 *   const objectiveStore = yield getObjectiveStoreFromSagaContext();
 * }
 * ```
 */
export function* getObjectiveStoreFromSagaContext(): Generator<any, ObjectiveStore, ObjectiveStore> {
  return yield getReduxSagaEffects().getContext('objectiveStore');
}
