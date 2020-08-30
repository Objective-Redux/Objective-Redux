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
 * ```typescript
 * import React from 'react';
 * import { useRegister } from 'objective-redux';
 * import { MyStateController } from './store/my-state-controller';
 *
 * export default function() {
 *   const register = useRegister();
 *   const { value } = MyStateController.getInstance(register).getStateSlice();
 *
 *   return <p>{ value }</p>;
 * }
 * ```
 */
export declare const useRegister: () => ReduxRegister | null;
//# sourceMappingURL=use-register.d.ts.map