import * as React from 'react';
import { ReduxRegister } from './';
import { RegisterProviderContext } from './context';

export function RegisterProvider({ register, children }: { register: ReduxRegister, children: any }) {
  return (
    <RegisterProviderContext.Provider value={register}>
      {children}
    </RegisterProviderContext.Provider>
  );
}