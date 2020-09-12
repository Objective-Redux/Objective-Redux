// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { Controller, ModelConstructor } from './controller';
import { getObjectiveStoreFromSagaContext } from './get-objective-store-from-saga-context';

/**
 * Gets a controller instance from the saga context.
 *
 * @template C The type of controller that will be returned. This type is inferred and does not need to be specified in
 * TypeScript.
 * @param controller The controller class of which an instance should be retrieved.
 * @returns A generator that yields an instance of the provided controller or null if there is no ObjectiveStore
 * instance in the saga's context.
 *
 * @example
 * ```typescript
 * // Also works with a StateController
 * class MyController extends StatelessController {
 *   // ...
 * }
 *
 * function* foo(): any {
 *   const myController = yield getControllerFromSagaContext(MyController);
 * }
 * ```
 */
export function* getControllerFromSagaContext<C extends Controller>(
  controller: typeof Controller & ModelConstructor<C>
): Generator<any, C|null, C> {
  const store: any = yield getObjectiveStoreFromSagaContext();

  if (!store) {
    return null;
  }

  return yield controller.getInstance(store);
}
