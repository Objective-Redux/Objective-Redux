// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { LazyLoader } from './lazy-loader';
import { ReduxRegister } from './redux-register';
import { Action } from './action';

export function lazyLoadingMiddleware(register: ReduxRegister): any {
  return (): Function => (next: Function): Function => (action: Action<any>): any => {
    const controller = LazyLoader.getControllerForAction(action);
    if (controller) {
      (controller as any).getInstance(register);
    }
    return next(action);
  };
}
