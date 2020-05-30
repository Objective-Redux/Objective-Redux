import * as React from 'react';
import { ReduxRegister } from './';
import { RegisterProviderContext } from './context';

/**
 * Provides a ReduxRegister to child React components.
 *
 * @param children the child components of the provider.
 * @param register an instance of the ReduxRegister.
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
 * @returns the provider that will render with its child components.
 */
export function RegisterProvider({ register, children }: { register: ReduxRegister, children: any }): JSX.Element {
  return (
    <RegisterProviderContext.Provider value={register}>
      {children}
    </RegisterProviderContext.Provider>
  );
}