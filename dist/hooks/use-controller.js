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
exports.useController = void 0;
var react_1 = require("react");
var hook_subscriber_1 = require("./hook-subscriber");
var use_objective_store_1 = require("./use-objective-store");
/**
 * Gets a controller from the ObjectiveStore using hook.
 *
 * @template C The type of controller that will be returned. This type is inferred and does not need to be specified in
 * TypeScript.
 * @param controller The controller class of which an instance should be retrieved.
 * @param selectorFn A state mapping function used to determine if the component needs to re-render. Defaults to
 * (state: any): any => state.
 * @returns An instance of the provided controller or null if there is no ObjectiveStore instance in the components
 * context.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useController } from 'objective-redux';
 * import { SwitchStateController } from './switch-state-controller';
 *
 * export function MyFunctionalComponent() {
 *   const switchStateController = useController(SwitchStateController);
 *   const { isOn } = switchStateController.getStateSlice();
 *
 *   return <p>Switch is { isOn ? 'On' : 'Off' }</p>;
 * }
 * ```
 */
// eslint-disable-next-line max-statements
var useController = function (controller, selectorFn) {
    if (selectorFn === void 0) { selectorFn = function (state) { return state; }; }
    var objectiveStore = use_objective_store_1.useObjectiveStore();
    var _a = react_1.useReducer(function (c) { return c + 1; }, 0), forceUpdate = _a[1];
    if (!objectiveStore) {
        return null;
    }
    var instance = controller.getInstance(objectiveStore);
    var i = 0;
    var getSlice = function () { return i++; };
    if (instance.getStateSlice) {
        getSlice = function () { return selectorFn(instance.getStateSlice()); };
    }
    var subscription = react_1.useMemo(function () { return new hook_subscriber_1.HookSubscriber(objectiveStore, getSlice, forceUpdate); }, [objectiveStore]);
    subscription.subscribe();
    react_1.useEffect(function () { return subscription.unsubscribe.bind(subscription); }, [objectiveStore]);
    return instance;
};
exports.useController = useController;
