// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { Action } from '../helpers/action';
import { PreDispatchHookFn } from './objective-store';

// eslint-disable-next-line jsdoc/require-description, jsdoc/require-param, jsdoc/require-returns
/**
 * @internal
 */
export function preDispatchHookMiddleware(preDispatchHook: PreDispatchHookFn): any {
  return (): Function => (next: Function): Function => (action: Action<any>): any => {
    const hookResult = preDispatchHook(action);
    if (hookResult?.then) {
      return hookResult.then(() => next(action));
    } else {
      return next(action);
    }
  };
}
