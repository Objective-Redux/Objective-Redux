// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { useContext, useReducer } from 'react';
import { RegisterProviderContext } from './context';
import { ReduxRegister } from '.';

/**
 * Gets the ReduxRegister from the React context for use in a functional component.
 *
 * As an alternative (for example, in class components where hooks cannot be used), the ComponentConnector may be used
 * instead.
 *
 * @returns An instance of the ReduxRegister, if one exists.
 *
 * @example
 * ```
 * import React from 'react';
 * import { useRegisterFromReactContext } from 'objective-redux';
 * import { MyStateController } from './store/my-state-controller';
 *
 * export default function() {
 *   const register = useRegisterFromReactContext();
 *   const { value } = MyStateController.getInstance(register).getStateSlice();
 *
 *   return <p>{ value }</p>;
 * }
 * ```
 */
export const useRegisterFromReactContext = (): ReduxRegister|null => {
  const register = useContext(RegisterProviderContext);
  const [, forceUpdate] = useReducer(c => c + 1, 0);

  /* istanbul ignore else */
  if (register) {
    register.subscribe(() => forceUpdate());
  }

  return register;
};
