// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { Action } from './action';
import { PreDispatchHookFn } from './redux-register';

export function preDispatchHookMiddleware(preDispatchHook: PreDispatchHookFn): any {
  // eslint-disable-next-line max-len
  return (): Function => (next: Function): Function => (action: Action<any>): Promise<any> => preDispatchHook(action).then(() => next(action));
}
