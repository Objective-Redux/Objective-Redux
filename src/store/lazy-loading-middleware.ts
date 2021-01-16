// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { Action } from '../helpers/action';
import { LazyLoader } from './lazy-loader';
import { ObjectiveStore } from './objective-store';

// eslint-disable-next-line jsdoc/require-description, jsdoc/require-param, jsdoc/require-returns
/**
 * @internal
 */
export function lazyLoadingMiddleware(objectiveStore: ObjectiveStore): any {
  return (): Function => (next: Function): Function => (action: Action<any>): any => {
    const controller = LazyLoader.getControllerForAction(action);
    if (controller) {
      (controller as any).getInstance(objectiveStore);
    }
    return next(action);
  };
}
