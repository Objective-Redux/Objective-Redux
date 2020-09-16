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
exports.ObjectiveStoreProvider = void 0;
var React = require("react");
var context_1 = require("./context");
/**
 * Provides an ObjectiveStore to child React components.
 *
 * @param object The properties being passed to the component.
 * @param object.children The child components of the provider.
 * @param object.objectiveStore An instance of the ObjectiveStore.
 *
 * @example
 * ```typescript
 * export const objectiveStore = new ObjectiveStore();
 *
 * ReactDOM.render(
 *   <ObjectiveStoreProvider objectiveStore={objectiveStore}>
 *     <App />
 *   </ObjectiveStoreProvider>,
 *   document.getElementById('root')
 * );
 * ```
 *
 * @returns The provider that will render with its child components.
 */
function ObjectiveStoreProvider(_a) {
    var objectiveStore = _a.objectiveStore, children = _a.children;
    return (React.createElement(context_1.ObjectiveStoreProviderContext.Provider, { value: objectiveStore }, children));
}
exports.ObjectiveStoreProvider = ObjectiveStoreProvider;
