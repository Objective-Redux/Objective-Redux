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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReducerInjector = exports.defaultReducer = void 0;
var redux_1 = require("redux");
/**
 * @internal
 */
/* istanbul ignore next */
var defaultReducer = function () { return ({}); };
exports.defaultReducer = defaultReducer;
/**
 * An object that handles injection of reducers into the Redux store that is managed by an ObjectiveStore.
 *
 * This can be used when middleware or another part of the application also needs to handle injection. For example,
 * this should be used when Redux-Injectors is being used with Objective Redux.
 *
 * @example
 * ```typescript
 * import { ReducerInjector, ObjectiveStore } from 'objective-redux';
 * import { createInjectorsEnhancer } from 'redux-injectors';
 * import { initialState, initialReducers } from './elsewhere';
 *
 * const injector = new ReducerInjector(initialReducers);
 *
 * const createReducer = injector.getReducerCreationFn();
 * const runSaga = injector.getRunSagaFn();
 *
 * const middleware = [
 *   createInjectorsEnhancer({ createReducer, runSaga }),
 * ];
 *
 * const objectiveStore = new ObjectiveStore({
 *   reducer,
 *   initialState,
 *   middleware,
 *   injector,
 * });
 * ```
 */
var ReducerInjector = /** @class */ (function () {
    /**
     * Creates an injector instance.
     *
     * @param initialReducers The initial reducers to add to the combine reducer.
     * @example
     * ```typescript
     * const injector = new ReducerInjector({
     *   MyReducer: reducerOne,
     * });
     * ```
     */
    function ReducerInjector(initialReducers) {
        if (initialReducers === void 0) { initialReducers = {}; }
        this.initialReducers = initialReducers;
        this.getObjectiveReduxReducers = null;
        this.injectedReducers = {};
    }
    /**
     * This function should not be called directly.
     *
     * Sets the get function for retrieving the reducers internal to Objective Redux.
     *
     * @param getObjectiveReduxReducers Function that can be called to get the reducers internal to Objective Redux.
     * This only be used by the ObjectiveStore and should not be called directly.
     *
     * @example
     * ```typescript
     * // Do not use this function directly!
     * ```
     */
    ReducerInjector.prototype.setGetObjectiveReduxReducers = function (getObjectiveReduxReducers) {
        this.getObjectiveReduxReducers = getObjectiveReduxReducers;
    };
    /**
     * This function should not be called directly.
     *
     * Sets the get function for running a Saga.
     *
     * @param sagaRunningFn Function used to run a saga.
     *
     * @example
     * ```typescript
     * // Do not use this function directly!
     * ```
     */
    ReducerInjector.prototype.setSagaRunningFn = function (sagaRunningFn) {
        this.sagaRunningFn = sagaRunningFn;
    };
    /**
     * A function that can be used to get add additional reducers to the store.
     *
     * @returns A function that takes a map of reducers. The reducers are added to the initial reducers and the reducers
     * internal to Objective Redux, resulting in a final, combined reducer.
     *
     * @example
     * ```typescript
     * const initialReducers = {
     *   MyInitialReducer: reducerOne,
     * };
     *
     * const injector = new ReducerInjector(initialReducers);
     * const reducerCreationFn = injector.getReducerCreationFn();
     *
     * const objectiveStore = new ObjectiveStore({
     *   injector,
     * });
     *
     * const nextReducer = reducerCreationFn({
     *   MyInitialReducer: reducerTwo,
     * });
     *
     * objectiveStore.replaceReducer(nextReducer);
     * ```
     */
    ReducerInjector.prototype.getReducerCreationFn = function () {
        var _this = this;
        return function (injectedReducers) {
            if (injectedReducers === void 0) { injectedReducers = _this.injectedReducers; }
            _this.injectedReducers = injectedReducers;
            var reducers = __assign(__assign(__assign({}, _this.initialReducers), _this.injectedReducers), (_this.getObjectiveReduxReducers && _this.getObjectiveReduxReducers()));
            return Object.keys(reducers).length > 0
                ? (0, redux_1.combineReducers)(reducers)
                : exports.defaultReducer;
        };
    };
    ReducerInjector.prototype.getSagaRunningFn = function () {
        var _this = this;
        return function (saga) { return _this.sagaRunningFn(saga); };
    };
    return ReducerInjector;
}());
exports.ReducerInjector = ReducerInjector;
