"use strict";
// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterProvider = void 0;
const React = require("react");
const context_1 = require("./context");
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
function RegisterProvider({ register, children }) {
    return (React.createElement(context_1.RegisterProviderContext.Provider, { value: register }, children));
}
exports.RegisterProvider = RegisterProvider;
