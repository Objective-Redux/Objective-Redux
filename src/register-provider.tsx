// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
import * as React from 'react';
import { RegisterProviderContext } from './context';
import { ReduxRegister } from './';

/**
 * Provides a ReduxRegister to child React components.
 *
 * @param object The properties being passed to the component.
 * @param object.children The child components of the provider.
 * @param object.register An instance of the ReduxRegister.
 *
 * @example
 * ```typescript
 * export const register = new ReduxRegister();
 *
 * ReactDOM.render(
 *   <RegisterProvider register={register}>
 *     <App />
 *   </RegisterProvider>,
 *   document.getElementById('root')
 * );
 * ```
 *
 * @returns The provider that will render with its child components.
 */
export function RegisterProvider({ register, children }: { register: ReduxRegister; children: any }): JSX.Element {
  return (
    <RegisterProviderContext.Provider value={register}>
      {children}
    </RegisterProviderContext.Provider>
  );
}
