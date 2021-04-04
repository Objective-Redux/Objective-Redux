"use strict";
// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelector = void 0;
var react_1 = require("react");
var hook_subscriber_1 = require("./hook-subscriber");
var use_objective_store_1 = require("./use-objective-store");
/**
 * Gets a selection of the state from the store.
 *
 * @param selectorFn A selector/mapping function used to select values out of the state.
 * @returns The selected piece of state from the store.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useSelector } from 'objective-redux';
 *
 * export function MyFunctionalComponent() {
 *   const { isOn } = useSelector(state => ({ isOn: state.switch.isOn }));
 *
 *   return <p>Switch is { isOn ? 'On' : 'Off' }</p>;
 * }
 * ```
 */
exports.useSelector = function (selectorFn) {
    var objectiveStore = use_objective_store_1.useObjectiveStore();
    var _a = react_1.useReducer(function (c) { return c + 1; }, 0), forceUpdate = _a[1];
    if (!objectiveStore) {
        return null;
    }
    var getSlice = function () { return selectorFn(objectiveStore.getState()); };
    var subscription = react_1.useMemo(function () { return new hook_subscriber_1.HookSubscriber(objectiveStore, getSlice, forceUpdate); }, [objectiveStore]);
    subscription.subscribe();
    react_1.useEffect(function () { return subscription.unsubscribe.bind(subscription); }, [objectiveStore]);
    return getSlice();
};
