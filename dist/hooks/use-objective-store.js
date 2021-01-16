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
exports.useObjectiveStore = void 0;
var react_1 = require("react");
var context_1 = require("../context");
/**
 * Gets the ObjectiveStore from the React context for use in a functional component.
 *
 * As an alternative (for example, in class components where hooks cannot be used), the ComponentConnector may be used
 * instead.
 *
 * @returns An instance of the ObjectiveStore, if one exists.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useObjectiveStore } from 'objective-redux';
 * import { MyStateController } from './store/my-state-controller';
 *
 * export default function() {
 *   const objectiveStore = useObjectiveStore();
 *   const { value } = MyStateController.getInstance(objectiveStore).getStateSlice();
 *
 *   return <p>{ value }</p>;
 * }
 * ```
 */
exports.useObjectiveStore = function () { return react_1.useContext(context_1.ObjectiveStoreProviderContext); };
