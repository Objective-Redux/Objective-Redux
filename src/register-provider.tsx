// ================================================================================================
//                                          Objective Redux
//                 (c) Copyright 2020 by Jason Mace (jmace01). All rights reserved.
//
// This code is provided under the terms of the [object Object] license. See the LICENSE file for
// terms.
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
