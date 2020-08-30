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
var react_1 = require("react");
var context_1 = require("./context");
var hook_subscriber_1 = require("./hook-subscriber");
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
exports.useRegister = function () {
    var register = react_1.useContext(context_1.RegisterProviderContext);
    var _a = react_1.useReducer(function (c) { return c + 1; }, 0), forceUpdate = _a[1];
    var subscription = react_1.useMemo(function () { return new hook_subscriber_1.HookSubscriber(register, forceUpdate); }, [register]);
    subscription.subscribe();
    react_1.useEffect(function () { return subscription.unsubscribe.bind(subscription); }, [register]);
    return register;
};
