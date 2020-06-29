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
exports.useRegister = void 0;
const react_1 = require("react");
const context_1 = require("./context");
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
exports.useRegister = () => {
    const register = react_1.useContext(context_1.RegisterProviderContext);
    const [, forceUpdate] = react_1.useReducer(c => c + 1, 0);
    /* istanbul ignore else */
    if (register) {
        register.subscribe(() => forceUpdate());
    }
    return register;
};
//# sourceMappingURL=use-register.js.map