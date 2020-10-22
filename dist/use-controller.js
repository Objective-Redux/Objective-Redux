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
exports.useController = void 0;
var use_objective_store_1 = require("./use-objective-store");
/**
 * Gets a controller from the ObjectiveStore using hook.
 *
 * @template C The type of controller that will be returned. This type is inferred and does not need to be specified in
 * TypeScript.
 * @param controller The controller class of which an instance should be retrieved.
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
exports.useController = function (controller) {
    var objectiveStore = use_objective_store_1.useObjectiveStore();
    if (!objectiveStore) {
        return null;
    }
    return controller.getInstance(objectiveStore);
};
