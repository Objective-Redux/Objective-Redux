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
exports.createConnectedAction = exports.createAction = exports.getActionNameForController = void 0;
/**
 * Gets an action name that can be used to fire a controller's action without using the controller.
 *
 * This can be used along with [[createAction]] to create an action.
 *
 * @param controllerName The name of the controller the action should target.
 * @param actionName The name of the registered action the action should target.
 * @param namespace The namespace of the controller. Defaults to a non-namespaced controller.
 * @returns The generated action name.
 *
 * @example
 * ```typescript
 * const action = createAction(getActionNameForController('myControllerName', 'myActionName'));
 * ```
 */
// eslint-disable-next-line max-params
function getActionNameForController(controllerName, actionName, namespace) {
    if (namespace === void 0) { namespace = ''; }
    return "OBJECTIVE-REDUX-ACTION/" + namespace.replace('/', '-') + "::" + controllerName.replace('/', '-') + "/" + actionName;
}
exports.getActionNameForController = getActionNameForController;
/**
 * Returns a function that generates a Redux action of the form { type, payload }.
 *
 * This is particularly useful for code-splitting or for firing actions to non-Objective-Redux reducers.
 *
 * @param type The name of the action being sent.
 * @returns The action generating function.
 *
 * @example
 * ```typescript
 * // To fire an action to a reducer not managed by Objective-Redux
 * const action = createAction('myAction');
 *
 * // To fire an action to an Objective-Redux controller without using the controller
 * const action = createAction(getActionNameForController('myControllerName', 'myActionName'));
 * ```
 */
function createAction(type) {
    return function (payload) { return ({
        type: type,
        payload: payload,
    }); };
}
exports.createAction = createAction;
/**
 * Returns a function that generates a Redux action of the form { type, payload }.
 *
 * @param type The name of the action being sent.
 * @param objectiveStore The ObjectiveStore instance to which to connect.
 * @returns The action generating function.
 * @internal
 */
function createConnectedAction(type, objectiveStore) {
    return function (payload) { return objectiveStore.dispatch({
        type: type,
        payload: payload,
    }); };
}
exports.createConnectedAction = createConnectedAction;
