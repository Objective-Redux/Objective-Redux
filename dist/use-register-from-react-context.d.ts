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
export declare const useRegisterFromReactContext: () => ReduxRegister | null;
//# sourceMappingURL=use-register-from-react-context.d.ts.map