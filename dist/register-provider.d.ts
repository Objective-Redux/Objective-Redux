/// <reference types="react" />
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
export declare function RegisterProvider({ register, children }: {
    register: ReduxRegister;
    children: any;
}): JSX.Element;
//# sourceMappingURL=register-provider.d.ts.map